import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItemImage } from '@/types/menu';

interface ImageCarouselProps {
  images: MenuItemImage[];
  itemName: string;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  itemName,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={images[0].imageUrl}
          alt={itemName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img
        src={images[currentIndex].imageUrl}
        alt={`${itemName} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {/* Navigation arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};