import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <Image
        src="/images/svtc-logo-white.png"
        alt="SVTC Logo"
        width={40}
        height={40}
        className="bg-primary rounded-full p-1"
      />
      <div>
        <div className="font-headline text-2xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors">
          Ra Marama
        </div>
        <p className="text-xs text-muted-foreground -mt-1">SVTC Cakaudrove</p>
      </div>
    </Link>
  );
}
