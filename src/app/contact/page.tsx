
import Image from 'next/image';

import ContactForm from './contact-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

// export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const locationText = "The Soqosoqo Vakamarama iTaukei Cakaudrove (SVTC) is headquartered at the Ra Marama Great Hall, located in the scenic coastal town of Savusavu, on the island of Vanua Levu in Fiji. Savusavu is known for its beautiful bay and is a center of commerce and tourism in the Cakaudrove province.";

  // const locationDetails = await generateSVTClocationDetails({ locationText });
  const locationDetails = {
    locationDescription: locationText,
    latitude: -16.788,
    longitude: 179.331
  };

  return (
    <div className="bg-background">
      <header className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Contact Us</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with questions, partnership inquiries, or to learn more about our work.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold">Get In Touch</h2>
              <p className="text-muted-foreground mt-2">
                Fill out the form or use the contact details below.
              </p>
            </div>
            <ContactForm />
            <Card className="bg-secondary/50 border-0">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Ra Marama Great Hall, Savusavu, Fiji</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">(679) 8962012</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">svtc2005@gmail.com</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Our Location</h3>
              {locationDetails && (
                <p className="text-muted-foreground mt-2">{locationDetails.locationDescription}</p>
              )}
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
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
