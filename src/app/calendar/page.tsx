import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { calendarData } from '@/lib/calendar-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Cloud, Waves, Sprout, Gift, Tractor } from 'lucide-react';

const categoryInfo = {
  Weather: { icon: Cloud, color: 'text-blue-500' },
  Farming: { icon: Tractor, color: 'text-amber-600' },
  Harvesting: { icon: Sprout, color: 'text-green-600' },
  Fishing: { icon: Waves, color: 'text-cyan-600' },
  Festivities: { icon: Gift, color: 'text-pink-500' },
};

export default function CalendarPage() {
  const calendarHeaderImage = PlaceHolderImages.find(p => p.id === 'calendar-header');

  return (
    <div className="bg-background">
      <header className="relative h-[50vh] flex items-center justify-center text-center text-white">
        {calendarHeaderImage && (
          <Image
            src={calendarHeaderImage.imageUrl}
            alt={calendarHeaderImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={calendarHeaderImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Traditional Seasonal and Lunar Calendar
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Explore the iTaukei calendar of Cakaudrove, a guide to the natural rhythms of the land and sea, passed down through generations.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {calendarData.map((month, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0 rounded-lg shadow-md bg-card transition-all hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-primary">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-primary hover:no-underline">
                  <span className="flex-1 text-left">{month.iTaukeiMonth} - {month.EnglishMonth}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <div className="space-y-4">
                    {Object.entries(month.details).map(([key, value]) => {
                      const info = categoryInfo[key as keyof typeof categoryInfo];
                      const Icon = info.icon;
                      return (
                        <div key={key} className="flex items-start gap-4">
                          <div className="mt-1">
                            <Icon className={`w-5 h-5 ${info.color}`} />
                          </div>
                          <div>
                            <h4 className="font-headline font-semibold text-foreground">{key}</h4>
                            <p className="text-muted-foreground">{value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
