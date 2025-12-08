import { type Metadata } from 'next';
import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import CallToActionSection from '@/components/shared/CallToAction';
import Image from 'next/image';
import Link from 'next/link';

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

        {/* Revolutionary Services Section */}
        <section className="py-24 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container max-w-[1400px] mx-auto px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  Premium Services
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                Choose Your Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Excellence</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Science-backed programs designed by experts to unlock your full athletic potential
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Training Programs Card - Enhanced */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 hover:-translate-y-2">
                {/* Premium Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-green-600 text-white rounded-full text-xs font-bold shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                    </svg>
                    POPULAR
                  </span>
                </div>

                {/* Image with Overlay Gradient */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <Image
                    src="/images/gym-train.jpg"
                    alt="Training Programs"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4">
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">500+</div>
                      <div className="text-white/90 text-xs">Athletes Trained</div>
                    </div>
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">95%</div>
                      <div className="text-white/90 text-xs">Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">Performance</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                    Training Programs
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Personalized training programs designed by certified trainers for all levels, from beginners to professional athletes.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Custom workout plans tailored to your goals</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Expert guidance from certified trainers</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Progress tracking and performance analytics</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Flexible scheduling to match your routine</p>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">From <span className="text-primary">995 EGP</span>/month</div>
                    <div className="text-sm text-muted-foreground">Choose from 3 packages</div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <a
                      href="/training"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        View Details
                        <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </span>
                    </a>
                    <Link
                      href="/pay/service/training"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-primary to-green-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Buy Now
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Nutrition Programs Card - Enhanced */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-600/30 hover:-translate-y-2">
                {/* Image with Overlay Gradient */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <Image
                    src="/images/nutrition-specialist.jpg"
                    alt="Nutrition Programs"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4">
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">300+</div>
                      <div className="text-white/90 text-xs">Meal Plans</div>
                    </div>
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">24/7</div>
                      <div className="text-white/90 text-xs">Support</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-600/10 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Nutrition</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-3 group-hover:text-green-600 transition-colors">
                    Nutrition Programs
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Professional nutrition programs designed specifically for athletes with personalized meal plans and continuous support.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Personalized meal plans according to your sport</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Expert guidance from certified nutritionists</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Supplement recommendations for performance</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Diet plans that adapt to your training schedule</p>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">From <span className="text-green-600">995 EGP</span>/month</div>
                    <div className="text-sm text-muted-foreground">Choose from 3 packages</div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <a
                      href="/nutrition"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        View Details
                        <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </span>
                    </a>
                    <Link
                      href="/pay/service/nutrition"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-600/50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Buy Now
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Psychology Consultations Card - Enhanced */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-600/30 hover:-translate-y-2">
                {/* Image with Overlay Gradient */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <Image
                    src="/images/podcast-image.jpg"
                    alt="Psychology Consultations"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Podcast Visualization Effect - Enhanced */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full animate-ping"></div>
                      <div className="relative bg-white/20 backdrop-blur-md rounded-full p-6 border-2 border-white/40 shadow-2xl">
                        <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4">
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">200+</div>
                      <div className="text-white/90 text-xs">Sessions Done</div>
                    </div>
                    <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="text-white font-bold text-2xl">98%</div>
                      <div className="text-white/90 text-xs">Satisfaction</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-600/10 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Mental Health</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    Psychology Consultations
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Sports psychology consultations to support you psychologically in your sports journey with specialized experts.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Mental performance training and confidence building</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Stress and anxiety management techniques</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Focus and concentration enhancement</p>
                    </div>
                    <div className="flex items-start group/item">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700 font-medium">Visualization and mental rehearsal techniques</p>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">From <span className="text-blue-600">995 EGP</span>/month</div>
                    <div className="text-sm text-muted-foreground">Choose from 3 packages</div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <a
                      href="/psychology"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        View Details
                        <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </span>
                    </a>
                    <Link
                      href="/pay/service/psychology"
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Buy Now
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators Section */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground font-medium">Active Athletes</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-600/5 to-transparent rounded-2xl border border-green-600/10">
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-sm text-muted-foreground font-medium">Expert Coaches</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-600/5 to-transparent rounded-2xl border border-blue-600/10">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-sm text-muted-foreground font-medium">Satisfaction Rate</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground font-medium">Support Available</div>
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
