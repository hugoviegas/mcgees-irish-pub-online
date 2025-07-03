import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-irish-red">
          Book Your Table Today
        </h2>
        <p className="text-gray-700 text-xl max-w-2xl mx-auto mb-10">
          Whether it's a special celebration, business lunch, or casual dinner,
          we'd be honored to have you join us at{" "}
          <span className="text-irish-gold font-semibold">D'Arcy McGee's</span>.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-0">
          <Button
            asChild
            className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow border-2 border-irish-red transition-colors"
          >
            <Link to="/reservations">Make a Reservation</Link>
          </Button>
          <Button
            asChild
            className="border-2 border-irish-gold text-irish-gold bg-white hover:bg-irish-gold/10 text-lg font-bold px-8 py-4 rounded-full shadow transition-colors"
          >
            <a href="tel:+35314907727">Call Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
