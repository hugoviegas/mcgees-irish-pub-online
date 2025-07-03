import React, { useState, useEffect } from "react";

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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[420px] md:h-[600px] overflow-hidden rounded-b-3xl shadow-lg">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`Slideshow ${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full border border-irish-gold bg-white/80 transition-all duration-300 ${
              idx === current ? "bg-irish-gold scale-110" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
