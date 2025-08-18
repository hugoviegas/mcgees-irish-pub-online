
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SpecialsModal from "./SpecialsModal";

const images = [
  "/darcy-uploads/hero/slideshow/slide1.jpg",
  "/darcy-uploads/hero/slideshow/slide2.jpg",
  // Add more image paths here
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showSpecials, setShowSpecials] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`Slideshow ${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
        />
      ))}

      <div className="container mx-auto px-4 z-20 flex flex-col items-center justify-end h-full pb-32">
        <div className="space-y-6 max-w-3xl text-center">
          <p className="text-sm md:text-base text-white/90 mx-auto max-w-xl mb-6">
            Check out today's chef specials and enjoy dishes prepared daily.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setShowSpecials(true)}
              className="bg-white text-irish-red hover:bg-white/90 text-lg font-bold px-6 py-3 rounded-full shadow border-2 border-white transition-colors w-full sm:w-auto"
            >
              Chef Specials Today
            </Button>

            <Button
              asChild
              className="bg-white text-irish-red hover:bg-white/90 text-lg font-bold px-6 py-3 rounded-full shadow border-2 border-white transition-colors w-full sm:w-auto"
            >
              <Link to="/menu">View Menu</Link>
            </Button>

            <Button
              asChild
              className="bg-white text-irish-red hover:bg-white/90 text-lg font-bold px-6 py-3 rounded-full shadow border-2 border-white transition-colors w-full sm:w-auto"
            >
              <a href="tel:+35314907727">Call Us</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 w-full text-center z-20">
        <a
          href="#welcome"
          className="inline-block animate-bounce text-white"
          aria-label="Scroll to content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            className={`block w-3 h-3 rounded-full border border-irish-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-irish-gold ${
              idx === current ? "bg-irish-gold scale-110" : "bg-white/60"
            }`}
          />
        ))}
      </div>
      <SpecialsModal open={showSpecials} onClose={() => setShowSpecials(false)} />
    </section>
  );
};

export default HeroSlideshow;
