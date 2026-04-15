import { ZodError } from "zod";

const fieldLabels: Record<string, string> = {
  name: "Name",
  full_name: "Full name",
  email: "Email address",
  phone: "Phone number",
  password: "Password",
  message: "Message",
};

export function getFriendlyErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    const issue = error.issues[0];

    if (!issue) {
      return fallback;
    }

    const field = issue.path[0];
    const label = typeof field === "string" ? fieldLabels[field] ?? humanize(field) : "This field";

    if (issue.code === "too_small" && typeof issue.minimum === "number") {
      if (field === "name") {
        return "Please enter your name.";
      }

      if (field === "password") {
        return "Password must be at least 8 characters.";
      }

      if (field === "message") {
        return "Please add a little more detail to your message.";
      }

      return `${label} is too short.`;
    }

    if (issue.code === "invalid_format" && field === "email") {
      return "Enter a valid email address.";
    }

    return issue.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function humanize(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
