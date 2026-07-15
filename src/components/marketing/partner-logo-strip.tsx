import Image from "next/image";
import Link from "next/link";
import { partners } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function PartnerLogoStrip() {
  const visiblePartners = partners;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 rounded-md bg-card px-8 py-8 shadow-card">
      {visiblePartners.map((partner) => {
        const logo = PlaceHolderImages.find((p) => p.id === partner.logoId);
        if (!logo) return null;
        return (
          <Link
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="relative h-9 w-24 opacity-80 transition-opacity duration-150 hover:opacity-100"
          >
            <Image
              src={logo.imageUrl}
              alt={logo.description}
              fill
              className="object-contain"
              data-ai-hint={logo.imageHint}
            />
          </Link>
        );
      })}
    </div>
  );
}
