import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1a2b3d] text-white">
      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start your journey with us now</h2>
          <p className="text-lg mb-8">Be part of a community that believes in ambition, science, and progress.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="inline-block py-3 px-6 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Browse Services
            </Link>
            <Link href="/courses" className="inline-block py-3 px-6 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe to Course
            </Link>
            <Link href="/contact" className="inline-block py-3 px-6 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
          </div>
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
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors text-sm">Curriculum</Link></li>
              <li><Link href="/specializations" className="text-gray-300 hover:text-white transition-colors text-sm">Specializations</Link></li>
              <li><Link href="/k12" className="text-gray-300 hover:text-white transition-colors text-sm">School Education Platform</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5 font-display">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">How to learn with sportschool</Link></li>
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
                         <Image src="https://www.edraak.org/static/images/google-play-badge.f8d429a39f28.png" width={160} height={48} alt="Get it on Google Play" />

                    </div>
                </a>
                 <a href="https://apps.apple.com/us/app/edraak/id1062539639" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="block w-[160px] h-[48px]">
                    <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/ios.624bd34de543-12.svg?" width={160} height={48} alt="Download on the App Store" />
                 </a>
             </div>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />
        
        <div className="flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left gap-y-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Sportology Plus. All rights reserved</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</Link>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                <Link href="/data-analytics-agreement" className="text-gray-300 hover:text-white transition-colors text-sm">Data Analytics Agreement</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};