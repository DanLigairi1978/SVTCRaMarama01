/**
 * Formats errors from Firebase, network requests, or standard JS exceptions
 * into clear, actionable, user-friendly messages.
 */
export function formatErrorMessage(err: unknown, fallbackMessage = "An unexpected error occurred. Please try again."): string {
  if (!err) return fallbackMessage;

  if (typeof err === "string") {
    return err.trim().length > 0 ? err : fallbackMessage;
  }

  const anyErr = err as { code?: string; message?: string; name?: string };

  const code = anyErr.code;
  if (code) {
    switch (code) {
      // Firebase Firestore & Common
      case "permission-denied":
        return "Permission denied: You do not have administrative permissions to make changes.";
      case "unauthenticated":
        return "Your session has expired. Please sign in again.";
      case "unavailable":
        return "The service is temporarily unavailable. Please check your network connection and retry.";
      case "resource-exhausted":
        return "Quota exceeded. Please contact the site administrator.";
      case "failed-precondition":
        return "Action could not be performed due to a system precondition.";

      // Firebase Storage
      case "storage/unauthorized":
        return "Permission denied: Only authorized administrators may upload or delete images.";
      case "storage/canceled":
        return "Image upload was canceled.";
      case "storage/quota-exceeded":
        return "Storage quota exceeded. Please contact the site administrator.";
      case "storage/retry-limit-exceeded":
        return "Upload timed out. Please check your internet connection and try again.";
      case "storage/invalid-checksum":
        return "Upload corrupted during transfer. Please try uploading the image again.";
      case "storage/object-not-found":
        return "The requested image could not be found.";

      // Firebase Auth
      case "auth/popup-closed-by-user":
        return "Sign-in was canceled before completion.";
      case "auth/popup-blocked":
        return "The sign-in popup was blocked by your browser. Please allow popups for this site.";
      case "auth/network-request-failed":
        return "Network error: Unable to contact authentication services. Check your connection.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      default:
        break;
    }
  }

  const message = anyErr.message;
  if (message) {
    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      return "Network connection issue. Please check your internet connection.";
    }
    // Clean up internal Firebase error prefixes like "Firebase: Error (auth/...)."
    const cleanMsg = message.replace(/^Firebase:\s*(?:Error\s*)?(?:\([^)]+\):?\s*)?/i, "").trim();
    if (cleanMsg.length > 0) return cleanMsg;
  }

  return fallbackMessage;
}
