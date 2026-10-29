import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatErrorMessage } from "../src/lib/error-utils";
import { validatePhotoFile, MAX_PHOTO_SIZE_BYTES } from "../src/lib/storage-images";
import { z } from "zod";

describe("formatErrorMessage", () => {
  test("handles null or undefined with fallback", () => {
    assert.equal(formatErrorMessage(null), "An unexpected error occurred. Please try again.");
    assert.equal(formatErrorMessage(undefined), "An unexpected error occurred. Please try again.");
    assert.equal(formatErrorMessage("", "Custom fallback"), "Custom fallback");
  });

  test("handles raw string errors", () => {
    assert.equal(formatErrorMessage("Something broke"), "Something broke");
  });

  test("translates Firebase Firestore codes", () => {
    assert.equal(
      formatErrorMessage({ code: "permission-denied" }),
      "Permission denied: You do not have administrative permissions to make changes."
    );
    assert.equal(
      formatErrorMessage({ code: "unauthenticated" }),
      "Your session has expired. Please sign in again."
    );
    assert.equal(
      formatErrorMessage({ code: "unavailable" }),
      "The service is temporarily unavailable. Please check your network connection and retry."
    );
  });

  test("translates Firebase Storage codes", () => {
    assert.equal(
      formatErrorMessage({ code: "storage/unauthorized" }),
      "Permission denied: Only authorized administrators may upload or delete images."
    );
    assert.equal(
      formatErrorMessage({ code: "storage/retry-limit-exceeded" }),
      "Upload timed out. Please check your internet connection and try again."
    );
    assert.equal(
      formatErrorMessage({ code: "storage/canceled" }),
      "Image upload was canceled."
    );
  });

  test("translates Firebase Auth codes", () => {
    assert.equal(
      formatErrorMessage({ code: "auth/popup-blocked" }),
      "The sign-in popup was blocked by your browser. Please allow popups for this site."
    );
    assert.equal(
      formatErrorMessage({ code: "auth/network-request-failed" }),
      "Network error: Unable to contact authentication services. Check your connection."
    );
  });

  test("handles network fetch errors", () => {
    assert.equal(
      formatErrorMessage(new Error("Failed to fetch")),
      "Network connection issue. Please check your internet connection."
    );
  });

  test("strips internal Firebase error wrappers", () => {
    assert.equal(
      formatErrorMessage(new Error("Firebase: Error (storage/unauthorized): Unauthorized.")),
      "Unauthorized."
    );
  });
});

describe("validatePhotoFile", () => {
  test("rejects null or undefined file", () => {
    const res = validatePhotoFile(null);
    assert.equal(res.valid, false);
    assert.match(res.error || "", /select an image/i);
  });

  test("rejects empty file (0 bytes)", () => {
    const file = new File([], "empty.png", { type: "image/png" });
    const res = validatePhotoFile(file);
    assert.equal(res.valid, false);
    assert.match(res.error || "", /empty/i);
  });

  test("rejects file over 5MB", () => {
    const bigContent = new Uint8Array(MAX_PHOTO_SIZE_BYTES + 1024);
    const file = new File([bigContent], "huge.jpg", { type: "image/jpeg" });
    const res = validatePhotoFile(file);
    assert.equal(res.valid, false);
    assert.match(res.error || "", /5MB limit/i);
  });

  test("rejects non-image MIME types", () => {
    const file = new File(["test-content"], "document.pdf", { type: "application/pdf" });
    const res = validatePhotoFile(file);
    assert.equal(res.valid, false);
    assert.match(res.error || "", /Unsupported file type/i);
  });

  test("accepts valid image formats (JPEG, PNG, WebP, GIF, AVIF)", () => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    for (const mime of validTypes) {
      const file = new File(["dummy-pixels"], `photo.${mime.split("/")[1]}`, { type: mime });
      const res = validatePhotoFile(file);
      assert.equal(res.valid, true, `Expected ${mime} to be valid`);
      assert.equal(res.error, undefined);
    }
  });
});

describe("Admin Email Matching", () => {
  const ADMIN_EMAILS = [
    "svtc05@gmail.com",
    "bulutani@yahoo.com",
    "ligarius22@gmail.com",
    "sheilamlunter@gmail.com",
    "navareafarm@gmail.com",
    "macashaw1@gmail.com",
    "karanavatulesiash@gmail.com",
    "bogiana2003@gmail.com",
    "mocelutujosiliva@gmail.com",
  ].map((e) => e.toLowerCase());

  function checkAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  test("matches exact admin emails", () => {
    assert.equal(checkAdmin("svtc05@gmail.com"), true);
    assert.equal(checkAdmin("ligarius22@gmail.com"), true);
  });

  test("matches admin emails regardless of case or whitespace", () => {
    assert.equal(checkAdmin("SVTC05@GMAIL.COM"), true);
    assert.equal(checkAdmin("  ligarius22@gmail.com  "), true);
    assert.equal(checkAdmin("SheilaMLunter@Gmail.com"), true);
  });

  test("rejects non-admin emails", () => {
    assert.equal(checkAdmin("unknown@example.com"), false);
    assert.equal(checkAdmin(""), false);
    assert.equal(checkAdmin(null), false);
    assert.equal(checkAdmin(undefined), false);
  });
});

describe("Contact Form Validation Schema", () => {
  const schema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(150),
    subject: z.string().trim().min(3).max(200),
    message: z.string().trim().min(10).max(5000),
  });

  test("rejects empty or whitespace-only inputs", () => {
    const res = schema.safeParse({
      name: "  ",
      email: "test@example.com",
      subject: "Inquiry",
      message: "Here is a valid long enough message.",
    });
    assert.equal(res.success, false);
  });

  test("rejects invalid email formats", () => {
    const res = schema.safeParse({
      name: "Litia Tuilagi",
      email: "not-an-email",
      subject: "Inquiry",
      message: "Here is a valid long enough message.",
    });
    assert.equal(res.success, false);
  });

  test("accepts valid contact payload", () => {
    const res = schema.safeParse({
      name: "Litia Tuilagi",
      email: "litia@example.com",
      subject: "Partnership Inquiry",
      message: "We would love to discuss a partnership with SVTC.",
    });
    assert.equal(res.success, true);
  });
});
