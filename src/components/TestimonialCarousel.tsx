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
        {duplicated.map((testimonial, index) => (
          <div key={index} className="testimonial-slide">
            <div className="testimonial-card-carousel">
              <div className="testimonial-quote">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="quote-icon">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" fill="currentColor"/>
                </svg>
              </div>
              <p>"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.position}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
