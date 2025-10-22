import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/features/landing/components/Header";
import { Footer } from "@/features/landing/components/Footer";
import { Award, Target, Users, TrendingUp, Globe, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Us - Sportology Plus",
  description: "Learn about SportologyPlus.com, your digital platform specialized in sports sciences. Discover our story, vision, and mission to advance sports education.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Advancing Sports Science Education
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SportologyPlus.com is the leading Arabic digital platform specialized in sports sciences, 
            delivering evidence-based education to athletes, coaches, and sports professionals.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 font-medium">Expert Courses</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600 font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A specialized digital platform bridging the gap between sports science research 
              and practical application in the Arabic-speaking market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Science-Based</h3>
              <p className="text-gray-600 leading-relaxed">
                All content is rooted in the latest sports science research and validated by industry experts.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert-Led</h3>
              <p className="text-gray-600 leading-relaxed">
                Courses designed and delivered by certified professionals with proven track records.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessible</h3>
              <p className="text-gray-600 leading-relaxed">
                Breaking language barriers by providing world-class sports education in Arabic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Market Opportunity
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                The Arabic-speaking sports education market represents a significant untapped 
                opportunity with over 400 million potential users seeking localized, 
                professional sports science content.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We identified a critical gap in specialized Arabic content where sports 
                development demands modern, research-backed knowledge delivered digitally.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Growing Demand</h3>
                  <p className="text-gray-600">
                    Sports participation in MENA region growing 15% annually with increasing 
                    demand for professional coaching and training.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Digital Transformation</h3>
                  <p className="text-gray-600">
                    E-learning adoption accelerating across Middle East with 85% of professionals 
                    preferring online education formats.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Untapped Market</h3>
                  <p className="text-gray-600">
                    Limited competition in Arabic sports science education presents first-mover 
                    advantage in rapidly expanding market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="p-10 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To become the most trusted Arabic platform for digital sports science education, 
                creating a scientifically advanced Arab sports community.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Universal access to modern sports science knowledge</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Empowering coaches through continuous digital education</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Building a more professional, digitally advanced sports ecosystem</p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Delivering specialized educational programs that combine professional courses, 
                customized services, and personalized support for sports professionals.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Quality Education:</span> Research-backed courses 
                    in sports sciences
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Personal Support:</span> Tailored consultations 
                    and customized programs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Digital Innovation:</span> Interactive, 
                    accessible learning experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded by a team of sports science experts and digital education specialists, 
                SportologyPlus emerged from a clear market need: the absence of high-quality, 
                research-based sports education content in Arabic.
              </p>
              <p>
                What began as a small initiative has evolved into a comprehensive platform serving 
                athletes, coaches, nutritionists, and sports professionals across 15+ countries. 
                Our growth reflects the market need for accessible, science-backed sports education.
              </p>
              <p>
                Today, SportologyPlus stands as a trusted authority in sports science education, 
                combining academic rigor with practical application through our digital-first approach. 
                We continue to expand our course offerings, enhance our platform technology, and 
                build partnerships with leading sports institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join our community of sports professionals and unlock your potential with expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              Browse Courses
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
