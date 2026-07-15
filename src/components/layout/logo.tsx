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
      <div className="font-headline text-[0.7rem] sm:text-xs md:text-sm font-bold leading-tight tracking-tight text-ivory-100 group-hover:text-ochre-200 transition-colors whitespace-nowrap">
        Nai Soqosoqo Vakamarama iTaukei Cakaudrove
      </div>
    </Link>
  );
}
