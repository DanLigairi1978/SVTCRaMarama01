const GITHUB_API = "https://api.github.com";
const REPO = process.env.NEXT_PUBLIC_GITHUB_IMAGES_REPO || "DanLigairi1978/svtcblogimages";
const BRANCH = "main";

function getToken(): string {
  const token = process.env.NEXT_PUBLIC_GITHUB_IMAGES_TOKEN;
  if (!token) {
    throw new Error(
      "NEXT_PUBLIC_GITHUB_IMAGES_TOKEN is not set. Add a fine-grained GitHub token scoped to the images repo to .env.local."
    );
  }
  return token;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return mimeMap[file.type] || "jpg";
}

export interface UploadedPhoto {
  path: string;
  url: string;
}

/** Uploads a photo to the svtcblogimages repo and returns its repo path + public jsDelivr URL. */
export async function uploadStoryPhoto(file: File, storyId: string, slot: number): Promise<UploadedPhoto> {
  const token = getToken();
  const ext = extensionFor(file);
  const path = `stories/${storyId}/${slot}-${Date.now()}.${ext}`;
  const content = await fileToBase64(file);

  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Add photo for story ${storyId} (slot ${slot})`,
      content,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub upload failed (${res.status}): ${body}`);
  }

  return { path, url: `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/${path}` };
}

/** Best-effort delete — swallows errors so a cleanup failure never blocks removing the Firestore doc. */
export async function deleteStoryPhoto(path: string): Promise<void> {
  try {
    const token = getToken();
    const getRes = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!getRes.ok) return;
    const { sha } = await getRes.json();

    await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `Remove photo ${path}`,
        sha,
        branch: BRANCH,
      }),
    });
  } catch (error) {
    console.warn("Best-effort delete of GitHub image failed:", path, error);
  }
}
