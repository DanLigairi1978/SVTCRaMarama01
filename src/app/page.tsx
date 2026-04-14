import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NewsSection } from '@/components/news-section';
import { featuredProjects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Palette, School, TrendingUp } from 'lucide-react';

const categoryIcons = {
  Culture: Palette,
  Education: School,
  Economy: TrendingUp,
};

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'home-hero');

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up">
            Women Stand Up and Shine.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
            Empowering the indigenous women of Cakaudrove through culture, education, and economic opportunity.
          </p>
          <Button asChild size="lg" className="animate-fade-in-up animation-delay-600">
            <Link href="/work">
              Discover Our Projects <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section id="featured" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Pillars</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              We focus on three key areas to create sustainable change and uplift our communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => {
              const Icon = categoryIcons[project.category];
              const projectImage = PlaceHolderImages.find(p => p.id === project.imageId);
              return (
                <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
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
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-foreground p-3 rounded-full border">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.summary}</p>
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

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Latest News & Updates</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Stay informed about our latest activities, announcements, and success stories.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-none bg-transparent shadow-none">
              <CardContent className="p-0">
                <NewsSection />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
