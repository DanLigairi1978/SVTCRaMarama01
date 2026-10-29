import { z } from "zod";

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(150, "Email must be under 150 characters."),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(200, "Subject must be under 200 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5,000 characters."),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
  success: boolean;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: typeof formData.get("name") === "string" ? (formData.get("name") as string).trim() : "",
    email: typeof formData.get("email") === "string" ? (formData.get("email") as string).trim() : "",
    subject: typeof formData.get("subject") === "string" ? (formData.get("subject") as string).trim() : "",
    message: typeof formData.get("message") === "string" ? (formData.get("message") as string).trim() : "",
  };

  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors in the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzv-n4TAqtkObrpFqcU4wtmfKWpcmwQ2XwokUKL4YKoJ6SoUXd1f_qbp6gjETezpzOb/exec";
  const { name, email, subject, message } = validatedFields.data;

  try {
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("email", email);
    params.append("subject", subject);
    params.append("message", message);
    params.append("timestamp", new Date().toISOString());

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}: ${response.statusText}`);
    }

    return {
      message: "Success! Your message has been sent to our team.",
      success: true,
      errors: {},
    };
  } catch (error: unknown) {
    console.error("Failed to submit to Google Sheets:", error);
    const isNetwork =
      error instanceof Error &&
      (error.message.includes("fetch") || error.message.includes("Network"));
    return {
      message: isNetwork
        ? "Network error: Unable to deliver message. Please check your internet connection and try again."
        : "Sorry, something went wrong sending your message. Please reach out to svtc2005@gmail.com directly.",
      success: false,
      errors: {},
    };
  }
}
