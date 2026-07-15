import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatBlock } from '@/components/marketing/stat-block';
import { PartnerLogoStrip } from '@/components/marketing/partner-logo-strip';
import { NewsSection } from '@/components/news-section';
import { featuredProjects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'home-hero');

  return (
    <div className="flex flex-col">
      <section className="relative h-[85vh] min-h-[560px] flex items-end text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/25 to-charcoal-900/10" />
        <div className="relative z-10 container px-4 pb-16 md:pb-24 max-w-3xl">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-ochre-200">
            Cakaudrove Province, Fiji
          </span>
          <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mt-4">
            Women Stand Up<br />and Shine.
          </h1>
          <p className="font-body text-lg md:text-xl text-ivory-200 max-w-xl mt-5 leading-relaxed">
            Empowering the indigenous women of Cakaudrove through culture, education, and economic opportunity.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="/work">
                Discover Our Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <Link href="/about">Our History</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-charcoal-900 py-10">
        <div className="container px-4 flex flex-wrap gap-x-16 gap-y-6">
          <StatBlock value="7" label="Funding Partners" tone="dark" />
          <StatBlock value="5" label="Strategic Priorities" tone="dark" />
          <StatBlock value="2005" label="Established" tone="dark" />
        </div>
      </section>

      <section id="featured" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-primary">What We Do</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mt-3">Our Core Pillars</h2>
            <p className="font-body text-lg text-muted-foreground mt-3 leading-relaxed">
              We focus on three key areas to create sustainable change and uplift our communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => {
              const projectImage = PlaceHolderImages.find(p => p.id === project.imageId);
              return (
                <Card key={project.id} className="overflow-hidden">
                  {projectImage && (
                    <div className="relative h-48">
                      <Image
                        src={projectImage.imageUrl}
                        alt={projectImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={projectImage.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <span className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      {project.category}
                    </span>
                    <CardTitle className="mt-1">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{project.summary}</p>
                    <Button asChild variant="link" className="p-0 h-auto">
                      <Link href="/work">Learn more <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24 bg-background">
        <div className="container mx-auto px-4">
          <PartnerLogoStrip />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-primary">Stay Informed</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mt-3">Latest News &amp; Updates</h2>
          </div>
          <NewsSection />
        </div>
      </section>
    </div>
  );
}
