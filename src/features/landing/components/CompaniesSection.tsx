import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const partnersLogos = [
  { alt: "Queen Rania Teacher Academy", src: "/images/company-logo-placeholder.svg" },
  { alt: "Arab Bank", src: "/images/proof-of-certifications.jpg" },
  { alt: "KPMG", src: "/images/nutrition-specialist.jpg" },
  { alt: "Turquoise Mountain", src: "/images/our-gym.jpg" },
  { alt: "American Academy of Pediatrics", src: "/images/our-podcasts.jpg" },
  { alt: "Netherlands Embassy", src: "/images/podcast-image.jpg" },
  { alt: "British Council", src: "/images/course1.png" },
  { alt: "Jack Ma Foundation", src: "/images/course2.png" },
  { alt: "Google.org", src: "/images/course3.png" },
  { alt: "UCL", src: "/images/milkshake-product.jpg" },
  { alt: "GIZ", src: "/globe.svg" },
  { alt: "META", src: "/next.svg" },
  { alt: "Crescent Petroleum", src: "/file.svg" },
  { alt: "Arab Potash", src: "/window.svg" },
  { alt: "Hikma", src: "/images/company-logo-placeholder.svg" },
  { alt: "Van Leer Foundation", src: "/images/proof-of-certifications.jpg" },
  { alt: "German Federal Ministry", src: "/images/nutrition-specialist.jpg" },
  { alt: "RIT", src: "/images/our-gym.jpg" },
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