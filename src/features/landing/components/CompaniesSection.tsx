import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import Image from "next/image";

// We define our logo data right here. In a real application, this might come from a CMS.
const companyLogos = [
  { src: "/images/company-logo-placeholder.svg", alt: "Meta" },
  { src: "/images/company-logo-placeholder.svg", alt: "British Council" },
  { src: "/images/company-logo-placeholder.svg", alt: "KPMG" },
  { src: "/images/company-logo-placeholder.svg", alt: "CIB Bank" },
  { src: "/images/company-logo-placeholder.svg", alt: "Queen Rania Foundation" },
  { src: "/images/company-logo-placeholder.svg", alt: "Van Leer Foundation" },
  { src: "/images/company-logo-placeholder.svg", alt: "Hikma" },
];

export const CompaniesSection = () => {
  // The InfiniteMovingCards component expects an array of items, where each item has a 'quote' property.
  // We'll map our logos into this format, using the Next.js Image component as the content.
  const logoItems = companyLogos.map((logo) => ({
    quote: (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={150}
        height={50}
        className="h-10 w-auto object-contain"
      />
    ),
  }));

  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto">
          نتعاون مع أبرز الشركات ونثق بنا الآلاف من المتعلّمين!
        </h2>
        <a href="#" className="inline-block mt-4 text-primary font-semibold hover:underline">
          شركاؤنا في النجاح &larr;
        </a>
      </div>
      
      {/* 
        Here we use the Aceternity UI component.
        - `items`: We pass our formatted logo images.
        - `direction`: "right" to match the RTL flow.
        - `speed`: "slow" for a professional, easy-to-read pace.
      */}
      <div className="mt-12">
        <InfiniteMovingCards
          items={logoItems}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
};