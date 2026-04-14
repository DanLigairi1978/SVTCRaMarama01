import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Landmark, Scale, Target, Handshake } from 'lucide-react';

const values = [
  {
    icon: Landmark,
    title: 'Respect for Culture',
    description: 'Upholding iTaukei traditions, language, and values as the foundation of our identity.',
  },
  {
    icon: Handshake,
    title: 'Wellbeing',
    description: 'Promoting the holistic health and social welfare of our women, children, and communities.',
  },
  {
    icon: Scale,
    title: 'Social Justice',
    description: 'Advocating for equality, fairness, and the fundamental rights of all our members.',
  },
];

export default function AboutPage() {
  const aboutHeaderImage = PlaceHolderImages.find(p => p.id === 'about-header');
  const hallImage = PlaceHolderImages.find(p => p.id === 'about-hall');
  const historyImage = PlaceHolderImages.find(p => p.id === 'about-history');

  return (
    <div className="bg-background">
      <header className="relative h-[50vh] flex items-center justify-center text-center text-white">
        {aboutHeaderImage && (
          <Image
            src={aboutHeaderImage.imageUrl}
            alt={aboutHeaderImage.description}
            fill
            className="object-cover object-[center_20%] brightness-50"
            priority
            data-ai-hint={aboutHeaderImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">About SVTC</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Learn about our journey, our purpose, and the values that guide our mission to empower the women of Cakaudrove.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24 space-y-16">
        <section id="history" className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Our History & Context</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                The Soqosoqo Vakamarama iTaukei Cakaudrove (SVTC) was revitalized in 2005, building on a long legacy of women's leadership in the province. Our journey reached a significant milestone in 2016 when we were officially registered as a Non-Governmental Organization (NGO).
              </p>
              <p>
                This formal recognition enabled us to expand our reach and impact, forging crucial partnerships and securing funding to implement structured programs. Today, SVTC stands as a pivotal organization dedicated to the holistic development of iTaukei women and their communities in Cakaudrove.
              </p>
            </div>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
            {historyImage && (
              <Image
                src={historyImage.imageUrl}
                alt={historyImage.description}
                fill
                className="object-cover"
                data-ai-hint={historyImage.imageHint}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </section>

        <section id="purpose" className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="w-8 h-8 text-accent" />
                Our Vision & Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-headline font-semibold text-foreground mb-1">Vision</h3>
                <p>To be a vibrant and empowered community of iTaukei women leading sustainable development in Cakaudrove.</p>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-foreground mb-1">Mission</h3>
                <p>To empower and support iTaukei women through programs in cultural preservation, education, economic growth, and social well-being.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Our Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {values.map(value => {
                  const Icon = value.icon;
                  return (
                    <li key={value.title} className="flex items-start gap-4">
                      <div className="p-2 bg-accent/10 rounded-full mt-1">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-headline font-semibold text-foreground">{value.title}</h4>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="great-hall" className="bg-secondary/50 rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {hallImage && (
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg order-last md:order-first">
                <Image
                  src={hallImage.imageUrl}
                  alt={hallImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={hallImage.imageHint}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">Ra Marama Great Hall</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our headquarters, the Ra Marama Great Hall in Savusavu, is the heart of our organization. More than just a building, it is a symbol of our strength, resilience, and unity.
              </p>
              <p className="text-muted-foreground">
                Designed in partnership with Architects Without Frontiers, the hall serves as a central hub for our training programs, community gatherings, and administrative operations. It stands as a testament to what we can achieve together and provides a welcoming space for all women of Cakaudrove.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}