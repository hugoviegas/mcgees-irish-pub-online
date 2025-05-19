
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>
      
      <div className="container mx-auto px-4 z-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">D'Arcy McGee's</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">Traditional Irish pub and restaurant bringing the spirit of Ireland to your neighborhood since 1998.</p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-irish-gold hover:bg-irish-gold/80 text-irish-green">
              <Link to="/menu">View Menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/reservations">Book a Table</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 w-full text-center z-20">
        <a href="#welcome" className="inline-block animate-bounce text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
