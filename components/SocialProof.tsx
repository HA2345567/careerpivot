import React, { useState, useEffect, useCallback } from 'react';
import { TESTIMONIALS } from '../constants';
import { Card, SectionHeader } from './ui/Primitives';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const SocialProof = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <section id="reviews" className="py-24 bg-zinc-900/30 border-y border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
            title="Life on the Other Side" 
            subtitle="Real professionals who successfully pivoted using our system."
        />
        
        <div 
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="w-full flex-shrink-0 p-4">
                             <Card className="p-8 md:p-12 flex flex-col items-center text-center h-full bg-zinc-950/80 border-zinc-800 relative group hover:border-zinc-700 transition-colors">
                                <Quote className="absolute top-6 left-6 h-8 w-8 text-zinc-800 fill-zinc-800/50" />
                                <div className="flex gap-1 mb-6">
                                    {[1,2,3,4,5].map(star => (
                                        <Star key={star} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-zinc-200 text-xl md:text-2xl italic leading-relaxed mb-8 relative z-10">
                                    "{t.quote}"
                                </p>
                                <div className="mt-auto flex flex-col items-center">
                                    <img src={t.image} alt={t.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20 mb-4" />
                                    <div>
                                        <div className="font-bold text-white text-lg">{t.name}</div>
                                        <div className="text-sm text-zinc-400">{t.title}</div>
                                        <div className="text-xs text-primary mt-1 font-medium">{t.company}</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all focus:outline-none z-20 shadow-lg"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <button 
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all focus:outline-none z-20 shadow-lg"
                aria-label="Next testimonial"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
