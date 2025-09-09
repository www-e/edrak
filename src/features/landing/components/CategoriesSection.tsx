import { Button } from "@/components/ui/button";

const categories = [
  "التكنولوجيا",
  "تطوير الذات",
  "الأعمال والريادة",
  "اللغات",
  "الفن، التصميم والإعلام",
  "العلوم الإنسانية",
  "البيئة الصفية",
  "التعليم وتدريب المعلمين",
];

export const CategoriesSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-muted/50 relative overflow-hidden">
      {/* 
        This SVG creates the gentle, sweeping curve at the bottom of the section.
        It's positioned absolutely and uses `currentColor` to match the page's 
        background color, creating a seamless transition.
      */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] -z-10 text-background" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,50 C300,100 1000,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold text-primary">
          ابدأ التعلّم مجاناً الآن!
        </h3>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground max-w-3xl mx-auto">
          اكتشف مجموعة واسعة من أكثر من 300 دورة، مصممة خصيصًا لتلبية مهاراتكم واهتماماتكم!
        </h2>
        
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {/* Main Category Button */}
          <Button size="lg" className="font-semibold rounded-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
            الاستعداد الوظيفي
          </Button>

          {/* Other Category Buttons */}
          {categories.map((category) => (
            <Button key={category} variant="outline" size="lg" className="font-semibold rounded-full px-6 py-3">
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};