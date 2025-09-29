import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const partnersLogos = [
  { alt: "Queen Rania Teacher Academy", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/QRTA_PNG-3.png?" },
  { alt: "Arab Bank", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/Logo_without_Tagline-3_11zon_3-4.jpg?" },
  { alt: "KPMG", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/KPMG_logo-5.png?" },
  { alt: "Turquoise Mountain", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/Turquoise_Mountain-Logo-6.png?" },
  { alt: "American Academy of Pediatrics", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/aap-logo-2017-cine-7.jpg?" },
  { alt: "Netherlands Embassy", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/logo_Kingdom_of_the_netherlands-8.png?" },
  { alt: "British Council", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/BritishCouncil_Logo-9.png?" },
  { alt: "Jack Ma Foundation", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/JMF-logo-10.png?" },
  { alt: "Google.org", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/google-logo-11.png?" },
  { alt: "UCL", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/University_College_London_logo-12.png?" },
  { alt: "GIZ", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/gizlogo_unternehmen-en-implemented-rgb-13.png?" },
  { alt: "META", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/Meta_Platforms_Inc._logo.svg-7.png?" },
  { alt: "Crescent Petroleum", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/Crescent_Petroleum_logo.svg-8.png?" },
  { alt: "Arab Potash", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/potash-14.png?" },
  { alt: "Hikma", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/1280px-Hikma_Pharmaceuticals_logo.svg_Custom-9.png?" },
  { alt: "Van Leer Foundation", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/VanLeer_short_colour-grey-15.png?" },
  { alt: "German Federal Ministry", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/German_Jordanian_Cooperation_logo_300_dpi-16.jpg?" },
  { alt: "RIT", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/images/ritlogo-17.png?" },
];

const row1 = partnersLogos.slice(0, 6);
const row2 = partnersLogos.slice(6, 12);
const row3 = partnersLogos.slice(12, 18);

interface Logo {
  alt: string;
  src: string;
}

const LogoRow = ({ logos, reverse = false }: { logos: Logo[], reverse?: boolean }) => (
  <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_40px,_black_calc(100%-40px),transparent_100%)]">
    <ul className={`flex items-center justify-center md:justify-start [&_li]:mx-2 group-hover:[animation-play-state:paused] ${reverse ? 'animate-infinite-scroll-reverse' : 'animate-infinite-scroll'}`}>
      {[...logos, ...logos].map((logo, index) => (
        <li key={index} className="flex-shrink-0">
          <div className="w-[184px] h-[112px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center p-4 transition-transform duration-300 hover:scale-105">
            <div className="relative w-full h-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                style={{ objectFit: 'contain' }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
                sizes="184px"
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export const CompaniesSection = () => {
    return (
        <section className="bg-secondary py-20">
            <div className="container mx-auto px-5 max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-y-12 lg:gap-x-16">
                    <div className="lg:w-7/12 w-full group">
                        <div className="flex flex-col gap-4">
                           <LogoRow logos={row1} />
                           <LogoRow logos={row2} reverse />
                           <LogoRow logos={row3} />
                        </div>
                    </div>
                    <div className="lg:w-5/12 w-full">
                        <h2 className="font-display text-4xl font-bold text-dark-navy leading-snug">
                            We collaborate with the most prominent companies and are trusted by thousands of learners!
                        </h2>
                        <a href="/partners" className="mt-6 inline-flex items-center gap-3 text-accent hover:text-primary transition-colors duration-300">
                          <span className="font-semibold text-lg">Our Success Partners</span>
                          <ChevronRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};