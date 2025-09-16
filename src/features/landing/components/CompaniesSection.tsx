import Image from "next/image";

// The logo data provided
const companyLogos = [
  { src: "/images/meta-logo.svg", alt: "Meta" },
  { src: "/images/google-org-logo.svg", alt: "Google.org" },
  { src: "/images/british-council-logo.svg", alt: "British Council" },
  { src: "/images/kpmg-logo.svg", alt: "KPMG" },
  { src: "/images/arab-bank-logo.svg", alt: "Arab Bank" },
  { src: "/images/queen-rania-logo.svg", alt: "Queen Rania Foundation" },
  { src: "/images/van-leer-logo.svg", alt: "Van Leer Foundation" },
  { src: "/images/hikma-logo.svg", alt: "Hikma" },
  { src: "/images/arab-potash-logo.svg", alt: "Arab Potash" },
];

// Helper component for a single carousel row to keep the code clean
const CarouselRow = ({ logos, direction = 'left' }: { logos: typeof companyLogos; direction?: 'left' | 'right' }) => {
  const extendedLogos = [...logos, ...logos];
  
  return (
    <div className="relative overflow-hidden">
      <div className={`flex ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
        {extendedLogos.map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mx-6 flex items-center justify-center"
            style={{ minWidth: '160px' }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={60}
              className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CompaniesSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main container using Flexbox for the two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* ===== Left Column: Logo Carousel ===== */}
          <div className="relative w-full lg:w-2/3">
            {/* Gradient Mask Overlay for the far left */}
            <div 
              aria-hidden="true"
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to right, 
                  hsl(var(--background)) 0%, 
                  transparent 15%, 
                  transparent 100%)`
              }}
            />
            
            {/* Rows Container */}
            <div className="flex flex-col gap-8 py-4">
              <CarouselRow logos={companyLogos} direction="left" />
              <CarouselRow logos={companyLogos} direction="right" />
              <CarouselRow logos={companyLogos} direction="left" />
            </div>
          </div>

          {/* ===== Right Column: Text Content ===== */}
          <div className="relative w-full lg:w-1/3 text-center lg:text-left">
             {/* Gradient Mask Overlay to fade into the carousel on the left */}
            <div 
              aria-hidden="true"
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to left, 
                  transparent 70%, 
                  hsl(var(--background)) 100%)`
              }}
            />

            {/* Actual text content */}
            <div className="relative z-0">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mx-auto mb-2">
                Partner with leading companies trusted by thousands of learners!
              </h2>
              <a 
                href="#" 
                className="group inline-flex items-center gap-1 text-primary font-semibold hover:underline transition-all duration-300 hover:gap-2"
              >
                Our Success Partners
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};