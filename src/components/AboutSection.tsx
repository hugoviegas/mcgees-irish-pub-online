import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="welcome" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10 px-2 md:px-0">
            <div className="rounded-2xl shadow-2xl overflow-hidden aspect-video">
              <iframe
                src="https://www.youtube.com/embed/wZ3WjL4QGSQ?autoplay=1&mute=1&controls=1&loop=1&playlist=wZ3WjL4QGSQ"
                title="D'Arcy McGee's Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-irish-red">
              Welcome to <span className="text-irish-gold">D'Arcy McGee's</span>
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Step into D'Arcy McGee's and feel right at home. Our pub is a
              gathering place for friends, families, and neighbors—a spot where
              laughter is shared, stories are told, and every guest is greeted
              with a warm Irish welcome.
            </p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Enjoy the cozy charm of our traditional interiors, the aroma of
              hearty Irish fare, and the sound of live music drifting through
              the air. Whether you're here for a quiet pint, a lively night out,
              or a family meal, you'll find genuine hospitality and a true sense
              of community.
            </p>
            <p className="text-gray-700 mb-10 text-lg leading-relaxed">
              We invite you to relax, unwind, and make yourself at home—because
              at D'Arcy McGee's, you're not just a customer, you're part of the
              family.
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
