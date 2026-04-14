
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { partners } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, Gift, HeartHandshake, Users } from 'lucide-react';

export default function InvolvedPage() {
  const involvedImage = PlaceHolderImages.find(p => p.id === 'get-involved-community');
  const involvedHeaderImage = PlaceHolderImages.find(p => p.id === 'involved-header');

  return (
    <div className="bg-background">
      <header className="relative h-[50vh] flex items-center justify-center text-center text-white">
        {involvedHeaderImage && (
          <Image
            src={involvedHeaderImage.imageUrl}
            alt={involvedHeaderImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={involvedHeaderImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Get Involved</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Join us in our mission. Your membership, support, and partnership are vital to creating lasting change.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24 space-y-20">
        <section id="how-to-join" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <Users className="w-4 h-4 mr-2" /> Membership
            </span>
            <h2 className="text-3xl font-bold">Become a Member</h2>
            <p className="text-lg text-muted-foreground">
              Membership is open to all indigenous women of Cakaudrove. Join a network of sisters dedicated to mutual support and community growth. You can join through:
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-bold text-accent">1</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Birth (Vasu)</h3>
                  <p className="text-sm text-muted-foreground">If you were born in the province of Cakaudrove.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-bold text-accent">2</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Marriage</h3>
                  <p className="text-sm text-muted-foreground">If you are married to a man from Cakaudrove.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-bold text-accent">3</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Residency</h3>
                  <p className="text-sm text-muted-foreground">If you have been a resident in the province for a significant period and are committed to the community.</p>
                </div>
              </li>
            </ul>
            <p className="text-muted-foreground pt-4">To begin the process, please get in touch with our office.</p>
            <Button asChild className="mt-4">
              <Link href="/contact">Contact Us To Join <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            {involvedImage && (
              <Image
                src={involvedImage.imageUrl}
                alt={involvedImage.description}
                fill
                className="object-cover"
                data-ai-hint={involvedImage.imageHint}
              />
            )}
          </div>
        </section>

        <section id="support-us" className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
          <HeartHandshake className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Support Our Vision</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-primary-foreground/80">
            As a non-profit organization, we rely on the generosity of donors and partners to fund our vital programs. Your contribution, no matter the size, directly supports economic empowerment, educational opportunities, and health initiatives for women and children in Cakaudrove.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/contact">
              <Gift className="mr-2 w-5 h-5" /> Partner With Us
            </Link>
          </Button>
        </section>

        <section id="partners">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Valued Partners</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We are grateful for the collaboration and support from organizations who share our vision.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-center">
              {partners.map(partner => {
                const logo = PlaceHolderImages.find(p => p.id === partner.logoId);
                if (!logo) return null;
                return (
                  <Link key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" title={partner.name} className="relative h-20 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex justify-center">
                    <Image
                      src={logo.imageUrl}
                      alt={logo.description}
                      fill
                      className="object-contain"
                      data-ai-hint={logo.imageHint}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
