'use client';

import { useState, useRef } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  position: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const duplicated = [...testimonials, ...testimonials];

  return (
    <div
      className="testimonial-carousel"
      ref={trackRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="testimonial-carousel-track"
        style={{
          animation: isPaused ? 'none' : 'testimonialScroll 25s linear infinite',
        }}
      >
        {duplicated.map((testimonial, index) => {
          const nameParts = testimonial.author.split(' ');
          const displayName = `${nameParts[0]} ${nameParts[1] || ''}`.trim();
          return (
            <div key={index} className="testimonial-slide">
              <div className="testimonial-card-carousel">
                <div className="testimonial-header">
                  <strong className="testimonial-name">{displayName}</strong>
                  <span className="testimonial-divider">|</span>
                  <span className="testimonial-sector">{testimonial.position}</span>
                </div>
                <p className="testimonial-text">{testimonial.quote}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
