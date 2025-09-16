"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

const activities = [
  {
    id: 1,
    title: "Edraak Innovation Summit 2023",
    date: "15-17 Nov 2023",
    location: "Amman, Jordan",
    attendees: "500+ participants",
    type: "Conference",
    description: "A gathering of educators, technologists, and innovators to discuss the future of online learning in the Arab world.",
    image: "/images/activity-placeholder-1.svg",
  },
  {
    id: 2,
    title: "Digital Skills Workshop Series",
    date: "Monthly sessions",
    location: "Online & Regional Centers",
    attendees: "1000+ learners",
    type: "Workshop",
    description: "Hands-on workshops covering essential digital skills for career advancement and personal development.",
    image: "/images/activity-placeholder-2.svg",
  },
  {
    id: 3,
    title: "Education for All Campaign",
    date: "Ongoing initiative",
    location: "Nationwide",
    attendees: "10,000+ beneficiaries",
    type: "Campaign",
    description: "Our commitment to providing free access to quality education for underserved communities across the region.",
    image: "/images/activity-placeholder-3.svg",
  },
];

export const ActivitiesSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            Our Activities & Initiatives
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Discover our latest campaigns, events, and community initiatives that are shaping the future of education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    {activity.type}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-heading">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground font-body">{activity.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {activity.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {activity.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {activity.attendees}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};