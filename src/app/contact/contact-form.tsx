"use client";

import { useState, useRef } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ContactFormState["errors"]>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const clearFieldError = (field: "name" | "email" | "subject" | "message") => {
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);

    const result = await submitContactForm(
      { message: "", success: false, errors: {} },
      formData
    );

    if (result.success) {
      setSuccessMessage(result.message);
      toast({
        title: "Message Sent",
        description: result.message,
      });
      formRef.current?.reset();
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      toast({
        title: "Unable to send message",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <Alert className="border-teal text-teal dark:border-teal">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your Name"
          required
          onChange={() => clearFieldError("name")}
          disabled={isSubmitting}
        />
        {errors?.name && (
          <p className="text-sm text-destructive mt-1 font-body">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          onChange={() => clearFieldError("email")}
          disabled={isSubmitting}
        />
        {errors?.email && (
          <p className="text-sm text-destructive mt-1 font-body">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Message Subject"
          required
          onChange={() => clearFieldError("subject")}
          disabled={isSubmitting}
        />
        {errors?.subject && (
          <p className="text-sm text-destructive mt-1 font-body">{errors.subject[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can we help? Write your message here..."
          rows={5}
          required
          onChange={() => clearFieldError("message")}
          disabled={isSubmitting}
        />
        {errors?.message && (
          <p className="text-sm text-destructive mt-1 font-body">{errors.message[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
