'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CallToActionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-green-100/50 to-blue-100/50">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            Start Your Training Journey Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of athletes who have transformed their performance with our certified trainers. 
            Your personalized training program is just one form away.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-green-500 text-white rounded-2xl mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">500+</div>
            <div className="text-muted-foreground">Athletes Trained</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-2xl mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">15+</div>
            <div className="text-muted-foreground">Certified Trainers</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl mx-auto mb-4">
              <Star className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">4.9/5</div>
            <div className="text-muted-foreground">Client Rating</div>
          </div>
        </motion.div>

        {/* CTA Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Primary CTA */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-green-300/20 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Fill out our comprehensive form and get your personalized training program within 24 hours. 
                Our certified trainers are ready to help you achieve your goals.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-muted-foreground">Join 500+ satisfied athletes</span>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-green-500 text-white hover:opacity-90 transition-opacity group"
              >
                Start Your Application
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-full -translate-y-16 -translate-x-16"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4">Need More Information?</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Not sure which program is right for you? Schedule a free consultation call with our trainers 
                to discuss your goals and get personalized recommendations.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Free 15-minute consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Personalized program recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">No commitment required</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-gray-900 transition-colors group"
              >
                Schedule Free Call
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Certified Trainers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>4.9/5 Client Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>500+ Happy Clients</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}