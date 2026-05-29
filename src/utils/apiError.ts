import axios from "axios";

/**
 * Normalizes Axios / Django JSON errors into a single user-facing string.
 */
export function formatApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data.trim();
    }

    if (data && typeof data === "object") {
      const rec = data as Record<string, unknown>;

      if (typeof rec.error === "string" && rec.error.trim()) {
        return rec.error.trim();
      }
      if (typeof rec.message === "string" && rec.message.trim()) {
        return rec.message.trim();
      }
      if (typeof rec.detail === "string" && rec.detail.trim()) {
        return rec.detail.trim();
      }
      if (Array.isArray(rec.detail) && rec.detail.length) {
        return rec.detail.map(String).join(", ");
      }

      for (const value of Object.values(rec)) {
        if (Array.isArray(value) && value.length > 0) {
          const first = value[0];
          if (typeof first === "string") {
            return first;
          }
        }
        if (typeof value === "string" && value.trim()) {
          return value.trim();
        }
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Da co loi xay ra. Vui long thu lai.";
}
