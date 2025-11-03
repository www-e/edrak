'use client';

import { motion } from 'framer-motion';
import { Play, Youtube, Podcast as PodcastIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const platforms = [
  { name: 'YouTube', icon: Youtube, link: '#' },
  { name: 'Spotify', icon: PodcastIcon, link: '#' },
];

export default function ContentMediaSection() {
  return (
    <section id="content" className="py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Mock Media Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-3xl bg-dark-navy relative overflow-hidden">
                {/* Podcast Image */}
                <Image
                  src="/images/podcast-image.jpg"
                  alt="Podcast recording session"
                  fill
                  className="object-cover rounded-3xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={true}
                />
                
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer group"
                  >
                    <Play className="w-10 h-10 text-white group-hover:scale-110 transition-transform" fill="white" />
                  </motion.div>
                </div>
                
                {/* Waveform decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center gap-1 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white/40 rounded-full"
                      animate={{
                        height: [
                          Math.random() * 40 + 10,
                          Math.random() * 50 + 20,
                          Math.random() * 40 + 10,
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <PodcastIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Sportology Plus</p>
                  <p className="text-xs text-muted-foreground">Weekly Podcast</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-6">
              <span className="text-xl">🎙️</span>
              <span>Sports Content</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Learn and Get Inspired from Stories
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mt-2">
                of Athletes and Experts
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Follow our <span className="font-bold text-foreground">Sportology Plus Weekly</span> program and podcast to learn about the latest trends, success stories, and expert tips in nutrition, training, and sports psychology.
            </p>

            {/* Content Types */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { icon: PodcastIcon, title: 'Weekly Podcast', desc: 'Specialized episodes with elite experts' },
                { icon: Play, title: 'Visual Programs', desc: 'Professional video content on YouTube' },
                { icon: FileText, title: 'Educational Articles', desc: 'Written content based on latest research' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-border hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Platforms */}
            <div className="bg-white/60 border border-border rounded-xl p-6 mb-6">
              <p className="text-sm font-bold text-foreground mb-4">Available on:</p>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                  >
                    <Link href={platform.link}>
                      <platform.icon className="w-4 h-4" />
                      {platform.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-bold">Completely Free</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
