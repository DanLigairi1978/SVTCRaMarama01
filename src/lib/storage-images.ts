import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { formatErrorMessage } from "./error-utils";

export interface UploadedPhoto {
  path: string;
  url: string;
}

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Validates file size and MIME type before sending to Firebase Storage.
 */
export function validatePhotoFile(file: File | null | undefined): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "Please select an image file to upload." };
  }

  if (file.size === 0) {
    return { valid: false, error: "The selected file is empty (0 bytes)." };
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB limit. Please choose a smaller image.`,
    };
  }

  const mime = file.type.toLowerCase();
  const isAllowedMime = ALLOWED_IMAGE_TYPES.includes(mime);
  const isImageMime = mime.startsWith("image/");

  if (!isAllowedMime && !isImageMime) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload a JPEG, PNG, WebP, or GIF image.",
    };
  }

  return { valid: true };
}

function extensionFor(file: File): string {
  const parts = file.name.split(".");
  const rawExt = parts.length > 1 ? parts.pop() : undefined;
  if (rawExt) {
    const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanExt.length > 0 && cleanExt.length <= 5) {
      return cleanExt === "jpeg" ? "jpg" : cleanExt;
    }
  }
  return MIME_TO_EXT[file.type.toLowerCase()] || "jpg";
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Uploads a story photo to Firebase Storage and returns its storage path and public download URL. */
export async function uploadStoryPhoto(file: File, storyId: string, slot: number): Promise<UploadedPhoto> {
  const check = validatePhotoFile(file);
  if (!check.valid) {
    throw new Error(check.error);
  }

  const safeStoryId = sanitizeId(storyId) || "temp";
  const safeSlot = Math.max(0, Math.min(2, Math.floor(slot)));
  const ext = extensionFor(file);
  const path = `stories/${safeStoryId}/${safeSlot}-${Date.now()}.${ext}`;

  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });
    const url = await getDownloadURL(storageRef);
    return { path, url };
  } catch (err) {
    console.error("Failed to upload story photo to Firebase Storage:", err);
    throw new Error(formatErrorMessage(err, "Failed to upload story photo. Please try again."));
  }
}

/** Uploads a staff portrait to Firebase Storage and returns its storage path and public download URL. */
export async function uploadStaffPhoto(file: File, staffId: string): Promise<UploadedPhoto> {
  const check = validatePhotoFile(file);
  if (!check.valid) {
    throw new Error(check.error);
  }

  const safeStaffId = sanitizeId(staffId) || "temp";
  const ext = extensionFor(file);
  const path = `staff/${safeStaffId}/portrait-${Date.now()}.${ext}`;

  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });
    const url = await getDownloadURL(storageRef);
    return { path, url };
  } catch (err) {
    console.error("Failed to upload staff photo to Firebase Storage:", err);
    throw new Error(formatErrorMessage(err, "Failed to upload staff portrait. Please try again."));
  }
}

/** Safely deletes an uploaded asset from Firebase Storage. Swallows errors so missing files don't block doc removal. */
async function safeDelete(path: string, allowedPrefix: "staff/" | "stories/"): Promise<void> {
  if (!path || typeof path !== "string") return;
  // Guard against deleting unintended root paths or external URLs
  if (!path.startsWith(allowedPrefix)) {
    console.warn(`Skipping delete: path "${path}" does not start with expected prefix "${allowedPrefix}"`);
    return;
  }

  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (err: any) {
    // If already deleted or not found, silently complete
    if (err?.code === "storage/object-not-found") {
      return;
    }
    console.warn("Best-effort delete from storage failed (may be legacy or already removed):", path, err);
  }
}

/** Best-effort delete of a staff photo from Firebase Storage. */
export async function deleteStaffPhoto(path: string): Promise<void> {
  await safeDelete(path, "staff/");
}

/** Best-effort delete of a story photo from Firebase Storage. */
export async function deleteStoryPhoto(path: string): Promise<void> {
  await safeDelete(path, "stories/");
}
