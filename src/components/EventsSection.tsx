
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const EventsSection = () => {
  return (
    <section className="py-16 wood-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-gold">Upcoming Events</h2>
          <p className="text-gray-200 max-w-xl mx-auto">
            Join us for live music, cultural events, and special promotions throughout the week.
          </p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 md:pr-8">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-irish-gold mr-2" />
                <h3 className="text-2xl font-bold font-serif text-irish-green">Live Music Saturdays</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Every Saturday night, we feature the best local and touring Irish musicians.
                From traditional folk tunes to modern Celtic rock, our stage comes alive with
                the sounds of Ireland. Tap your feet, clap your hands, and join in the chorus
                as we celebrate our musical heritage.
              </p>
              <div className="mb-6">
                <h4 className="font-semibold text-irish-brown mb-2">Upcoming Performances:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-24 text-sm font-medium text-gray-500">May 22</span>
                    <span className="font-medium">The Dublin Rogues</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-24 text-sm font-medium text-gray-500">May 29</span>
                    <span className="font-medium">Celtic Whispers</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-24 text-sm font-medium text-gray-500">June 5</span>
                    <span className="font-medium">The Shamrock Tenors</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-irish-green hover:bg-irish-green/90 text-white">
                  <Link to="/events">View All Events</Link>
                </Button>
                <Button asChild variant="outline" className="border-irish-green text-irish-green hover:bg-irish-green hover:text-white">
                  <a href="tel:+35312345678">Book a Table: (01) 234-5678</a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="Live music at D'Arcy McGee's" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold font-serif mb-3 text-irish-green">Happy Hour</h3>
            <p className="text-gray-700 mb-3">
              Monday - Friday, 4pm - 7pm. Enjoy discounted drinks and appetizers.
            </p>
            <Button asChild variant="outline" size="sm" className="border-irish-green text-irish-green hover:bg-irish-green hover:text-white">
              <Link to="/events">Learn More</Link>
            </Button>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold font-serif mb-3 text-irish-green">Irish Whiskey Tasting</h3>
            <p className="text-gray-700 mb-3">
              Last Thursday of every month. Sample the finest Irish whiskeys with our expert.
            </p>
            <Button asChild variant="outline" size="sm" className="border-irish-green text-irish-green hover:bg-irish-green hover:text-white">
              <Link to="/events">Book a Spot</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
