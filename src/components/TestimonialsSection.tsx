import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Siobhan Murphy",
    quote:
      "The most authentic Irish pub experience outside of Dublin! Amazing food and the weekend music acts are top-notch.",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael O'Connor",
    quote:
      "Best pint of Guinness in the city, hands down. The staff makes you feel like you're part of the family.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Thompson",
    quote:
      "We had our anniversary dinner here and it was perfect. The shepherd's pie is absolutely delicious!",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    rating: 4,
  },
  {
    id: 4,
    name: "James Wilson",
    quote:
      "Great atmosphere, friendly staff, and excellent selection of whiskeys. The live music on Saturdays is always a treat.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 font-serif text-irish-red text-center">
          What Our Guests Say
        </h2>
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-2xl mx-auto bg-irish-gold/10 rounded-2xl shadow-lg p-10 text-center">
            <img
              src={active.image}
              alt={active.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-xl md:text-2xl text-irish-brown mb-6 font-serif">
              “{active.quote}”
            </p>
            <div className="flex items-center justify-center mb-2">
              {Array.from({ length: active.rating }).map((_, i) => (
                <span key={i} className="text-irish-gold text-2xl">
                  ★
                </span>
              ))}
            </div>
            <div className="text-lg font-bold text-irish-red">
              {active.name}
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === activeIndex ? "bg-irish-gold" : "bg-gray-300"
                }`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
