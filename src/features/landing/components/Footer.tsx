import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1a2b3d] text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Level Up Your Sports Game Today!</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join over 10,000 athletes, coaches, and professionals who have transformed their careers. Get instant access to expert courses and start your journey to success.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="inline-block py-4 px-8 bg-primary-foreground text-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link href="/courses" className="inline-block py-4 px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground font-bold rounded-lg hover:bg-primary-foreground hover:text-primary transition-all duration-300">
              Explore Courses
            </Link>
          </div>
          <p className="text-sm opacity-90">No credit card required • Cancel anytime • 30-day money-back guarantee</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          
          {/* Column 1: Logo & Social */}
          <div className="flex flex-col items-start">
            <h2 className="text-4xl font-bold text-white mb-2 font-display">Sportology Plus</h2>
            <p className="text-gray-400 text-base">Ambition, Science, Progress</p>
            
            <h3 className="font-bold text-lg text-white mt-10 mb-4 font-display">Follow us on social networks</h3>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://www.facebook.com/EdraakOrg/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="https://twitter.com/edraakorg" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><Twitter size={24} /></a>
              <a href="https://www.instagram.com/edraakorg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><Instagram size={24} /></a>
              <a href="https://www.linkedin.com/school/edraak/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={24} /></a>
              <a href="https://www.youtube.com/channel/UC__mh5-5o_3j2Cj76-1M8UA" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors"><Youtube size={24} /></a>
            </div>
          </div>

          {/* Column 2: Browse Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5 font-display">Browse</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors text-sm">Courses</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link href="/psychology" className="text-gray-300 hover:text-white transition-colors text-sm">Psychology</Link></li>
              <li><Link href="/training" className="text-gray-300 hover:text-white transition-colors text-sm">Training</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/k12" className="text-gray-300 hover:text-white transition-colors text-sm">School Education</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5 font-display">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="https://help.edraak.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Help Center</Link></li>
            </ul>
          </div>
      
          {/* Column 4: App Downloads */}
          <div className="flex flex-col items-start">
             <h3 className="font-bold text-lg text-white mb-5 font-display">Learn anytime, anywhere with the sportschool app!</h3>
             <div className="flex flex-col space-y-4">
                <a href="https://play.google.com/store/apps/details?id=org.edraak.android" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" className="block w-[160px] h-[48px]">
                    <div className="bg-black border border-gray-700 rounded-md flex items-center justify-center h-full w-full">
                         {/* Placeholder for Google Play Badge */}
                         <Image src="/images/google-play-badge-ar.svg" width={160} height={48} alt="Get it on Google Play" />

                    </div>
                </a>
                 <a href="https://apps.apple.com/us/app/edraak/id1062539639" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="block w-[160px] h-[48px]">
                    <Image src="/images/apple-store-badge-ar.svg" width={160} height={48} alt="Download on the App Store" />
                 </a>
             </div>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />
        
        <div className="flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left gap-y-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Sportology Plus. All rights reserved</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link href="/legal" className="text-gray-300 hover:text-white transition-colors text-sm">Legal & Privacy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};