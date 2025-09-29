import React from 'react';
import Image from 'next/image';
import { Calendar, ChevronRight } from 'lucide-react';

const blogPosts = [
  {
    imageUrl: 'https://blog.edraak.org/wp-content/uploads/2025/03/IHG-PR-scaled.jpg',
    date: 'March 17, 2025',
    title: 'IHG Academy and Edraak Launch Online Training Course: Careers in Hospitality',
    excerpt: 'In a new step towards empowering aspiring professionals in the hospitality sector in Jordan, IHG Academy announced its collaboration with Queen Rania Foundation for Education and Development (QRF) and Edraak platform to launch a new Arabic language course titled "Careers in Hospitality". This course aims to provide an excellent opportunity for those interested in working in the hospitality field to deepen their knowledge and expand their skills in...',
    link: 'https://blog.edraak.org/?p=24859',
  },
  {
    imageUrl: 'https://blog.edraak.org/wp-content/uploads/2023/08/dc209da8-3c83-883c-3250-8dbadab6daea.png',
    date: 'August 9, 2023',
    title: 'Early Childhood Development: Investing in Our Future',
    excerpt: "Early Childhood Development Sciences is a multidisciplinary field focused on children's growth and development from birth to age eight. Early childhood development scientists seek to understand and analyze how children grow and develop in all aspects of their lives, including physical, cognitive, emotional, and social development. There are many factors that affect children's growth and development, including",
    link: 'https://blog.edraak.org/?p=24809',
  },
  {
    imageUrl: 'https://blog.edraak.org/wp-content/uploads/2023/06/Career-Cover.jpg',
    date: 'June 22, 2023',
    title: 'Hala Group and Edraak Launch "Career Compass" Program to Empower Career-Focused Youth to Find Jobs and Achieve Professional Success',
    excerpt: 'Online training courses designed to build the capabilities of young people in preparing CVs, conducting interviews, and searching for suitable jobs to help them succeed and advance in their work. Hala Group and Edraak aim to reach one million young men and women in the Middle East and North Africa region, helping them develop their potential and achieve success in the labor market. Sharjah, United Arab Emirates',
    link: 'https://blog.edraak.org/?p=24802',
  },
];

export const BlogSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold text-3xl mb-4">SportSchool Blog</h2>
          <p className="text-4xl font-bold text-foreground">
            Stay informed with the latest articles and updates in the education world!
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground text-left">Latest additions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-card rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl">
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative h-56 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </a>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-4 gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 min-h-[4rem]">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </h3>
                <p className="text-base text-muted-foreground mb-6 line-clamp-4 flex-grow">
                  {post.excerpt}
                </p>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold flex items-center mt-auto self-start hover:underline gap-2 transition-colors">
                  <span>View Post</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};