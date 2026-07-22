import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";

interface PageHeaderProps {
  image?: ImagePlaceholder;
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ image, eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="relative h-[46vh] min-h-[360px] flex items-end text-white">
      {image && (
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover object-[center_20%]"
          priority
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-charcoal-900/10" />
      <div className="relative z-10 container px-4 pb-12 md:pb-16 max-w-3xl">
        <SectionEyebrow tone="accent">{eyebrow}</SectionEyebrow>
        <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight mt-1.5">{title}</h1>
        {description && (
          <p className="font-body text-lg text-ivory-200 max-w-2xl mt-4 leading-relaxed">{description}</p>
        )}
      </div>
    </header>
  );
}
