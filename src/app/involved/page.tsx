
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { PartnerLogoStrip } from '@/components/marketing/partner-logo-strip';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { ArrowRight, Gift, HeartHandshake, Users } from 'lucide-react';

export default function InvolvedPage() {
  const involvedImage = PlaceHolderImages.find(p => p.id === 'get-involved-community');
  const involvedHeaderImage = PlaceHolderImages.find(p => p.id === 'involved-header');

  return (
    <div className="bg-background">
      <PageHeader
        image={involvedHeaderImage}
        eyebrow="Get Involved"
        title="Join Us in Cakaudrove"
        description="Join us in our mission. Your membership, support, and partnership are vital to creating lasting change."
      />

      <main className="container mx-auto px-4 py-16 md:py-24 space-y-20">
        <section id="how-to-join" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full font-label text-xs font-semibold uppercase tracking-wide">
              <Users className="w-4 h-4 mr-2" /> Membership
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Become a Member</h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Membership is open to all indigenous women of Cakaudrove. Join a network of sisters dedicated to mutual support and community growth. You can join through:
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-headline font-bold text-accent">1</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Birth (Vasu)</h3>
                  <p className="font-body text-sm text-muted-foreground">If you were born in the province of Cakaudrove.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-headline font-bold text-accent">2</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Marriage</h3>
                  <p className="font-body text-sm text-muted-foreground">If you are married to a man from Cakaudrove.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-full mt-1">
                  <span className="font-headline font-bold text-accent">3</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-foreground">Residency</h3>
                  <p className="font-body text-sm text-muted-foreground">If you have been a resident in the province for a significant period and are committed to the community.</p>
                </div>
              </li>
            </ul>
            <p className="font-body text-muted-foreground pt-4">To begin the process, please get in touch with our office.</p>
            <Button asChild className="mt-4">
              <Link href="/contact">Contact Us To Join <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-md overflow-hidden shadow-elevated">
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

        <section id="support-us" className="bg-charcoal-900 text-ivory-100 rounded-md p-8 md:p-12 text-center">
          <HeartHandshake className="w-14 h-14 mx-auto mb-4 text-ochre-200" />
          <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Support Our Vision</h2>
          <p className="font-body mt-4 text-lg max-w-3xl mx-auto text-ivory-300">
            As a non-profit organization, we rely on the generosity of donors and partners to fund our vital programs. Your contribution, no matter the size, directly supports economic empowerment, educational opportunities, and health initiatives for women and children in Cakaudrove.
          </p>
          <Button asChild variant="inverse" size="lg" className="mt-8">
            <Link href="/contact">
              <Gift className="mr-2 w-5 h-5" /> Partner With Us
            </Link>
          </Button>
        </section>

        <section id="partners">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Our Valued Partners</h2>
            <p className="font-body text-muted-foreground mt-2 max-w-2xl mx-auto">
              We are grateful for the collaboration and support from organizations who share our vision.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <PartnerLogoStrip />
          </div>
        </section>
      </main>
    </div>
  );
}
