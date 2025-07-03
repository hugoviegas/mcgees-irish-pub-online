import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="welcome" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <img
              src="/darcy-uploads/bar-img1.jpg"
              alt="D'Arcy McGee's pub interior"
              className="rounded-2xl shadow-2xl"
            />
          </div>

          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-irish-red">
              Welcome to <span className="text-irish-gold">D'Arcy McGee's</span>
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Nestled in the heart of the city, D'Arcy McGee's brings authentic
              Irish hospitality to life. Our pub is named after Thomas D'Arcy
              McGee, a father of Canadian confederation with proud Irish roots.
            </p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Step through our doors and experience the warm embrace of a
              traditional Irish pub, where every guest is treated like family.
              Our classic wooden interiors, comfortable seating, and friendly
              staff create the perfect atmosphere for any occasion.
            </p>
            <p className="text-gray-700 mb-10 text-lg leading-relaxed">
              Whether you're joining us for a hearty Irish breakfast, a business
              lunch, dinner with family, or a pint with friends, we promise an
              experience that will keep you coming back.
            </p>
            <Button
              asChild
              className="bg-irish-gold hover:bg-irish-gold/90 text-irish-red text-xl font-bold px-8 py-4 rounded-full shadow border-2 border-irish-red transition-colors"
            >
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
