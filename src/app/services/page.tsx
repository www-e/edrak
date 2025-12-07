import { type Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import CallToActionSection from '@/components/shared/CallToAction';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Services | SportologyPlus',
  description: 'Comprehensive sports development services including training, nutrition, and psychology for athletes of all levels',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <div className="py-24 bg-gradient-to-br from-primary/10 via-green-100/50 to-blue-100/50">
          <div className="container max-w-[1400px] mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              <span className="text-gray-900">Comprehensive</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-600 to-primary mt-3">
                Sports Development Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6">
              Everything you need for your sports development in one platform that combines science, experience, and continuous support.
            </p>
          </div>
        </div>

        {/* Enhanced Services Section with Images */}
        <section className="py-20 bg-white">
          <div className="container max-w-[1400px] mx-auto px-6">
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Training Programs Card */}
              <div className="bg-white rounded-2xl border-2 border-primary/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-64 overflow-hidden">
                  <Image
                    src="/images/gym-train.jpg"
                    alt="Training Programs"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Training Programs</h3>
                  <p className="text-muted-foreground mb-4">
                    Personalized training programs designed by certified trainers for all levels, from beginners to professional athletes.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Custom workout plans tailored to your goals</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Expert guidance from certified trainers</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Progress tracking and performance analytics</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Flexible scheduling to match your routine</p>
                    </div>
                  </div>
                  <a
                    href="/training"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
                  >
                    Explore Programs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Nutrition Programs Card */}
              <div className="bg-white rounded-2xl border-2 border-primary/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-64 overflow-hidden">
                  <Image
                    src="/images/nutrition-specialist.jpg"
                    alt="Nutrition Programs"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Nutrition Programs</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional nutrition programs designed specifically for athletes with personalized meal plans and continuous support.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Personalized meal plans according to your sport</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Expert guidance from certified nutritionists</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Supplement recommendations for performance</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Diet plans that adapt to your training schedule</p>
                    </div>
                  </div>
                  <a
                    href="/nutrition"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
                  >
                    Explore Programs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Psychology Consultations Card with Podcast Visualization */}
              <div className="bg-white rounded-2xl border-2 border-primary/20 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                <div className="h-64 overflow-hidden relative">
                  <Image
                    src="/images/podcast-image.jpg"
                    alt="Psychology Consultations"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Podcast Visualization Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30 animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Psychology Consultations</h3>
                  <p className="text-muted-foreground mb-4">
                    Sports psychology consultations to support you psychologically in your sports journey with specialized experts.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Mental performance training and confidence building</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Stress and anxiety management techniques</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Focus and concentration enhancement</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="ml-3 text-muted-foreground">Visualization and mental rehearsal techniques</p>
                    </div>
                  </div>
                  <a
                    href="/psychology"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
                  >
                    Explore Programs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CallToActionSection
          title="Ready to Transform Your Athletic Performance?"
          description="Join thousands of athletes who have improved their performance with our comprehensive programs."
        />
      </main>
      <Footer />
    </div>
  );
}