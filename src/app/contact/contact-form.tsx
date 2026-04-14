"use client";

import { useState, useRef } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ContactFormState['errors']>({});
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Pass empty state as first arg to match the signature of submitContactForm
    // even though we are calling it directly now.
    const result = await submitContactForm(
      { message: "", success: false, errors: {} },
      formData
    );

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      formRef.current?.reset();
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" required />
        {errors?.name && (
          <p className="text-sm text-destructive mt-1">{errors.name[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Your Email" required />
        {errors?.email && (
          <p className="text-sm text-destructive mt-1">{errors.email[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Message Subject" required />
        {errors?.subject && (
          <p className="text-sm text-destructive mt-1">{errors.subject[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
        {errors?.message && (
          <p className="text-sm text-destructive mt-1">{errors.message[0]}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
