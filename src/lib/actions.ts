// "use server"; // Removed for static export compatibility

import { z } from "zod";
// import { revalidatePath } from "next/cache"; // Not available in client
// import nodemailer from "nodemailer"; // Removed for client-side
// import { config } from 'dotenv'; // client side env vars are auto loaded if NEXT_PUBLIC

// config(); // Load environment variables

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
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
  prevState: ContactFormState,
  formData: FormData
) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to send message. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzv-n4TAqtkObrpFqcU4wtmfKWpcmwQ2XwokUKL4YKoJ6SoUXd1f_qbp6gjETezpzOb/exec';
  const { name, email, subject, message } = validatedFields.data;

  try {
    // Construct URLSearchParams for x-www-form-urlencoded data
    // Google Apps Script usually handles this well
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('subject', subject);
    params.append('message', message);
    params.append('timestamp', new Date().toISOString());

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store'
    });

    // Google Apps Script redirects to a JSON response usually, or returns JSON.
    // We can assume success if we get a 200/302 from the fetch calls that follow redirects.

    // Note: If the script returns a 302 redirect, Next.js fetch on server might follow it or return it.
    // Usually with 'follow: follow' (default), it resolves to the final page.

    // For specific error handling we might parse the text, but for now let's assume if it doesn't throw it worked.
    // Or we can check response.ok

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}: ${response.statusText}`);
    }

    // revalidatePath("/contact");

    return {
      message: "Success! Your message has been sent to our team.",
      success: true,
      errors: {},
    };

  } catch (error) {
    console.error("Failed to submit to Google Sheets:", error);
    return {
      message: "Sorry, something went wrong. Please try again later.",
      success: false,
      errors: {},
    };
  }
}
