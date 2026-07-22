import { cn } from "@/lib/utils";

interface StatBlockProps {
  value: string;
  label: string;
  tone?: "light" | "dark";
}

export function StatBlock({ value, label, tone = "light" }: StatBlockProps) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "font-headline text-4xl font-semibold leading-none md:text-5xl",
          dark ? "text-ivory-100" : "text-primary"
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "font-label text-xs font-medium uppercase tracking-[0.12em]",
          dark ? "text-ivory-300" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  );
}
