import React, { useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showPrev = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  const showNext = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="rounded-lg shadow-md cursor-pointer hover:opacity-80"
            onClick={() => openLightbox(idx)}
          />
        ))}
      </div>
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            className="absolute left-4 text-white text-3xl font-bold"
            onClick={showPrev}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <img
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />
          <button
            className="absolute right-4 text-white text-3xl font-bold"
            style={{ top: "50%" }}
            onClick={showNext}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
