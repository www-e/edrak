import { Button } from "@/components/ui/button";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* 
        This is the decorative background shape. 
        It's a large, blurred, semi-transparent div positioned absolutely.
        This technique creates the soft, modern "gradient blob" effect.
      */}
      <div 
        aria-hidden="true" 
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-secondary/30 dark:bg-secondary/40 blur-3xl -z-10"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight font-heading">
              Aspire. Learn. Advance.
            </h1>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground font-body">
              Enhance your skills through specialized programs in professional skill development, and earn certificates that support your career journey. All for free!
            </p>
            <Button size="lg" className="mt-8 font-bold text-lg px-8 py-6 rounded-lg font-heading">
              Explore Our Educational Programs
            </Button>
            
            <div className="mt-12 flex justify-center lg:justify-start gap-x-8 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-x-2">
                <span className="text-xl" role="img" aria-label="light bulb">💡</span>
                <span className="font-body">High-Quality & Trusted Content</span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="text-xl" role="img" aria-label="graduation cap">🎓</span>
                <span className="font-body">Learn for Free</span>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative flex justify-center items-center h-full min-h-[300px] lg:min-h-0">
            {/* Using Next.js Image component for performance optimization */}
            <Image
              src="/images/hero-image-edrak.png"
              alt="Happy students learning and advancing their careers"
              width={600}
              height={600}
              quality={95}
              priority // This tells Next.js to load this image first, as it's above the fold.
              className="relative z-10 max-w-full h-auto rounded-lg object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};