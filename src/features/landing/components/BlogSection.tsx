import React from 'react';

export const BlogSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold text-3xl mb-4">About Us</h2>
          <p className="text-4xl font-bold text-foreground">
            Sportology Plus – Your partner in your ongoing sports journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We at Sportology Plus are not just a company, but a specialized team in sports sciences that combines academic expertise and practical application to provide a comprehensive experience aimed at developing your professional capabilities, athletic performance, and general health.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you are a professional athlete seeking to elevate your level, a coach looking for reliable scientific sources, or a beginner wanting to start with the right steps – we are here to be your supporter and success partner at every stage of your sports journey.
          </p>
        </div>
      </div>
    </section>
  );
};