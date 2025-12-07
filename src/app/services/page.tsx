import { type Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import CallToActionSection from '@/components/shared/CallToAction';

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

        {/* Services Navigation Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-[1400px] mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl border-2 border-primary/20 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-4">Training Programs</h3>
                <p className="text-muted-foreground mb-6">
                  Personalized training programs designed by certified trainers for all levels.
                </p>
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
              
              <div className="text-center p-8 rounded-2xl border-2 border-primary/20 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-4">Nutrition Programs</h3>
                <p className="text-muted-foreground mb-6">
                  Professional nutrition programs designed specifically for athletes with personalized meal plans.
                </p>
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
              
              <div className="text-center p-8 rounded-2xl border-2 border-primary/20 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-4">Psychology Consultations</h3>
                <p className="text-muted-foreground mb-6">
                  Sports psychology consultations to support you psychologically in your sports journey.
                </p>
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