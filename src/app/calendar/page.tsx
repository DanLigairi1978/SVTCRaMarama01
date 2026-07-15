import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageHeader } from '@/components/layout/page-header';
import { calendarData } from '@/lib/calendar-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Cloud, Waves, Sprout, Gift, Tractor } from 'lucide-react';

const categoryInfo = {
  Weather: { icon: Cloud, color: 'text-teal-600' },
  Farming: { icon: Tractor, color: 'text-ochre-600' },
  Harvesting: { icon: Sprout, color: 'text-primary' },
  Fishing: { icon: Waves, color: 'text-teal-600' },
  Festivities: { icon: Gift, color: 'text-berry-600' },
};

export default function CalendarPage() {
  const calendarHeaderImage = PlaceHolderImages.find(p => p.id === 'calendar-header');

  return (
    <div className="bg-background">
      <PageHeader
        image={calendarHeaderImage}
        eyebrow="Calendar"
        title="Traditional Seasonal &amp; Lunar Calendar"
        description="Explore the iTaukei calendar of Cakaudrove, a guide to the natural rhythms of the land and sea, passed down through generations."
      />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {calendarData.map((month, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0 rounded-md shadow-card bg-card transition-colors hover:bg-secondary/40 focus-within:ring-2 focus-within:ring-ring">
                <AccordionTrigger className="px-6 py-4 font-headline text-lg font-semibold text-primary hover:no-underline">
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
                            <h4 className="font-label text-xs font-semibold uppercase tracking-wide text-foreground">{key}</h4>
                            <p className="font-body text-muted-foreground">{value}</p>
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
