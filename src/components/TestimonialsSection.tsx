
import { useState } from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Siobhan Murphy",
      quote: "The most authentic Irish pub experience outside of Dublin! Amazing food and the weekend music acts are top-notch.",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael O'Connor",
      quote: "Best pint of Guinness in the city, hands down. The staff makes you feel like you're part of the family.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Thompson",
      quote: "We had our anniversary dinner here and it was perfect. The shepherd's pie is absolutely delicious!",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: "James Wilson",
      quote: "Great atmosphere, friendly staff, and excellent selection of whiskeys. The live music on Saturdays is always a treat.",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
    },
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-green">What Our Guests Say</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Don't just take our word for it - hear from our wonderful customers about their experiences at D'Arcy McGee's.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative pb-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 ${
                  index === activeIndex ? "opacity-100" : "opacity-0 absolute top-0 left-0 right-0"
                }`}
              >
                {index === activeIndex && (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={i < testimonial.rating ? "#D4AF37" : "#D1D5DB"}
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-xl italic text-gray-700 mb-6">"{testimonial.quote}"</blockquote>
                    <cite className="font-serif text-lg font-medium text-irish-green block">- {testimonial.name}</cite>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? "bg-irish-gold" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
