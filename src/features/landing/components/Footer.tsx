import Image from 'next/image';
import { Linkedin, Youtube, Instagram, Twitter, Facebook } from 'lucide-react';

const socialLinks = [
  { href: '#', icon: Facebook },
  { href: '#', icon: Twitter },
  { href: '#', icon: Instagram },
  { href: '#', icon: Youtube },
  { href: '#', icon: Linkedin },
];

const linkColumns = {
  "sportschool": [
    { href: "#", text: "About sportschool" },
    { href: "#", text: "How to Learn with sportschool" },
    { href: "#", text: "Terms of Service" },
    { href: "#", text: "Privacy Policy" },
  ],
  "More": [
    { href: "#", text: "Blog" },
    { href: "#", text: "sportschool Podcast" },
    { href: "#", text: "Contact Us" },
    { href: "#", text: "Help Center" },
  ],
  "Browse": [
    { href: "#", text: "Specializations" },
    { href: "#", text: "School Education Platform" },
  ],
};

export const Footer = () => {
  return (
    // We use a dark background color directly, as the footer is always dark.
    <footer className="bg-background text-foreground relative pt-20">
      {/* 
        This SVG creates the elegant curved shape at the top of the footer.
        It sits above the footer's content, and its color is set to the main
        page background to create a perfect "cutout" effect.
      */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 120 0 0 1200 0 1200 120z"
            className="fill-background"
          ></path>
          <path
            d="M600,112.77C268.63,112.77,0,65.52,0,7.23V0h1200v7.23C1200,65.52,931.37,112.77,600,112.77Z"
            className="fill-background" // Must match the footer's background color
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(linkColumns).map(([title, links]) => (
              <div key={title}>
                <h5 className="font-bold text-foreground tracking-wider font-heading">{title}</h5>
                <ul className="mt-4 space-y-3 text-sm">
                  {links.map((link) => (
                    <li key={link.text}>
                      <a href={link.href} className="hover:text-foreground transition-colors font-body">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social & Apps (takes up remaining space) */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-foreground text-lg font-heading">Learn Anywhere</h4>
            <p className="text-sm mt-2 font-body">
              Learn anytime, anywhere with the sportschool app!
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#">
                <Image src="/images/apple-store-badge-en.svg" alt="Download on the App Store" width={150} height={50} className="h-12 w-auto" />
              </a>
              <a href="#">
                <Image src="/images/google-play-badge-en.svg" alt="Get it on Google Play" width={150} height={50} className="h-12 w-auto" />
              </a>
            </div>
            <h4 className="font-bold text-foreground text-lg mt-8 font-heading">
              Find Us on Social Media
            </h4>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="hover:text-foreground transition-colors">
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

        </div>
        <div className="border-t border-border mt-8 pt-6 text-sm text-center text-muted-foreground font-body">
          <p>&copy; {new Date().getFullYear()} sportschool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};