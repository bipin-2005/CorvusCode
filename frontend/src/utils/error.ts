import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}