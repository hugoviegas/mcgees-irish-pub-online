import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const images = [
  "/darcy-uploads/hero/slideshow/slide1.jpg",
  "/darcy-uploads/hero/slideshow/slide2.jpg",
  // Add more image paths here
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
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
      <div className="container mx-auto px-4 z-20 flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex justify-center">
          <img
            src="/darcy-uploads/logo.png"
            alt="D'Arcy McGee's"
            className="h-32 md:h-40 drop-shadow-lg"
          />
        </div>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-lg">
          Traditional Irish pub and restaurant bringing the spirit of Ireland to
          your neighborhood since 1998.
        </p>
        <div className="space-x-4 mb-12">
          <Button
            asChild
            className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow border-2 border-irish-red transition-colors"
          >
            <Link to="/menu">View Menu</Link>
          </Button>
          <Button
            asChild
            className="border-white text-white hover:bg-white/10 text-lg font-bold px-8 py-4 rounded-full shadow border-2 border-white transition-colors"
          >
            <a href="tel:+35314907727">Call Us</a>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 w-full text-center z-20">
        <a href="#welcome" className="inline-block animate-bounce text-white">
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
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full border border-irish-gold bg-white/80 transition-all duration-300 ${
              idx === current ? "bg-irish-gold scale-110" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
