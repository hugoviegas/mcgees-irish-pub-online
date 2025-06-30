import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/darcy-uploads/front-door.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      <div className="container mx-auto px-4 z-20">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/darcy-uploads/logo.png"
              alt="D'Arcy McGee's"
              className="h-32 md:h-40"
            />
          </div>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Traditional Irish pub and restaurant bringing the spirit of Ireland
            to your neighborhood since 1998.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red"
            >
              <Link to="/menu">View Menu</Link>
            </Button>
            <Button
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/reservations">Book a Table</Link>
            </Button>
          </div>
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
    </section>
  );
};

export default Hero;
