import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <Image
        src="/images/svtc-logo-white.png"
        alt="SVTC Logo"
        width={38}
        height={38}
        className="bg-rust-500 rounded-full p-1.5"
      />
      <div>
        <div className="font-headline text-lg font-bold tracking-tight text-ivory-100 group-hover:text-ochre-200 transition-colors">
          Ra Marama
        </div>
        <p className="font-label text-[0.65rem] uppercase tracking-[0.14em] text-ivory-300 -mt-0.5">SVTC Cakaudrove</p>
      </div>
    </Link>
  );
}
