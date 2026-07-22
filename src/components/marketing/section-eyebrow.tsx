import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  children: React.ReactNode;
  /** `primary` (rust) on light surfaces, `accent` (ochre) over dark/photo bands. */
  tone?: "primary" | "accent";
  /** Center for stacked section headings; left-align for split layouts. */
  align?: "left" | "center";
  className?: string;
}

/**
 * Decorative Dancing Script kicker set above a section title — the reference-restyle
 * replacement for the old uppercase-tracked Archivo eyebrow.
 */
export function SectionEyebrow({
  children,
  tone = "primary",
  align = "left",
  className,
}: SectionEyebrowProps) {
  return (
    <span
      className={cn(
        "block font-script text-2xl md:text-3xl font-semibold leading-none",
        tone === "accent" ? "text-ochre-200" : "text-primary",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </span>
  );
}
