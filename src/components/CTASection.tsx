
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-irish-red">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-irish-gold">Book Your Table Today</h2>
        <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
          Whether it's a special celebration, business lunch, or casual dinner, 
          we'd be honored to have you join us at D'Arcy McGee's.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red">
            <Link to="/reservations">Make a Reservation</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <a href="tel:+35312345678">Call (01) 123-4567</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
