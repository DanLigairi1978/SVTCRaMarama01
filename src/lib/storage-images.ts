import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadedPhoto {
  path: string;
  url: string;
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

/** Uploads a story photo to Firebase Storage and returns its storage path and public download URL. */
export async function uploadStoryPhoto(file: File, storyId: string, slot: number): Promise<UploadedPhoto> {
  const ext = extensionFor(file);
  const path = `stories/${storyId}/${slot}-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  return { path, url };
}

/** Uploads a staff portrait to Firebase Storage and returns its storage path and public download URL. */
export async function uploadStaffPhoto(file: File, staffId: string): Promise<UploadedPhoto> {
  const ext = extensionFor(file);
  const path = `staff/${staffId}/portrait-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  return { path, url };
}

/** Best-effort delete from Firebase Storage. Swallows errors so missing files don't block doc removal. */
export async function deleteStaffPhoto(path: string): Promise<void> {
  if (!path) return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn("Best-effort delete of staff photo failed (may be legacy or already removed):", path, err);
  }
}

/** Best-effort delete from Firebase Storage. Swallows errors so missing files don't block doc removal. */
export async function deleteStoryPhoto(path: string): Promise<void> {
  if (!path) return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn("Best-effort delete of story photo failed (may be legacy or already removed):", path, err);
  }
}
