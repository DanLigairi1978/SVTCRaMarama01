
import ContactForm from './contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { SectionEyebrow } from '@/components/marketing/section-eyebrow';
import { MapPin, Phone, Mail } from 'lucide-react';

export default async function ContactPage() {
  const locationDetails = {
    locationDescription: "The Soqosoqo Vakamarama iTaukei Cakaudrove (SVTC) is headquartered at the Ra Marama Great Hall, located in the scenic coastal town of Savusavu, on the island of Vanua Levu in Fiji. Savusavu is known for its beautiful bay and is a center of commerce and tourism in the Cakaudrove province.",
  };

  return (
    <div className="bg-background">
      <header className="bg-charcoal-900 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <SectionEyebrow tone="accent" align="center">Get in touch</SectionEyebrow>
          <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-ivory-100 mt-1">Contact Us</h1>
          <p className="font-body mt-4 text-lg md:text-xl text-ivory-300 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out with questions, partnership inquiries, or to learn more about our work.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-headline text-3xl font-semibold tracking-tight">Get In Touch</h2>
              <p className="font-body text-muted-foreground mt-2">
                Fill out the form or use the contact details below.
              </p>
            </div>
            <ContactForm />
            <Card className="bg-secondary/50 shadow-none">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-body text-muted-foreground">Ra Marama Great Hall, Savusavu, Fiji</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-body text-muted-foreground">(679) 8962012</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-body text-muted-foreground">svtc2005@gmail.com</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="font-headline text-2xl font-semibold tracking-tight">Our Location</h3>
              <p className="font-body text-muted-foreground mt-2">{locationDetails.locationDescription}</p>
            </div>
            <div className="relative aspect-video w-full rounded-md overflow-hidden shadow-elevated">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3795.797241285819!2d179.3308183155799!3d-16.78801968864075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x67a3de4b4916a23b%3A0x89c162f447a9e32a!2sRa%20Marama%20Hall!5e0!3m2!1sen!2sfj!4v1698782977325"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
