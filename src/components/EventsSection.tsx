import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useEventsData } from "@/hooks/useEventsData";
import { format, isAfter, isSameDay, addDays } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";

const EventsSection = () => {
  const { events, loading, error } = useEventsData();
  const today = new Date();
  const nextSaturday = addDays(today, (6 - today.getDay() + 7) % 7);
  let featuredEvent = null;
  if (events && events.length > 0) {
    featuredEvent = events.find((e) => {
      const eventDate = new Date(e.date);
      return (
        isSameDay(eventDate, nextSaturday) || isAfter(eventDate, nextSaturday)
      );
    });
    if (!featuredEvent) {
      featuredEvent = events[events.length - 1];
    }
  }

  return (
    <section className="py-16 wood-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-gold">
            Upcoming Events
          </h2>
          <p className="text-gray-200 max-w-xl mx-auto">
            Join us for live music, cultural events, and special promotions
            throughout the week.
          </p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 md:pr-8">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-irish-gold mr-2" />
                <h3 className="text-2xl font-bold font-serif text-irish-green">
                  {featuredEvent ? featuredEvent.title : "No Events Available"}
                </h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {featuredEvent ? (
                  <>
                    {format(new Date(featuredEvent.date), "PPPPp")}
                    <br />
                    {featuredEvent.description ||
                      "Join us for a special event night!"}
                  </>
                ) : (
                  "Check back soon for upcoming events."
                )}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button
                  asChild
                  className="bg-irish-red hover:bg-irish-gold text-white hover:text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow border-2 border-irish-gold transition-colors"
                >
                  <Link to="/events">View All Events</Link>
                </Button>
                <Button
                  asChild
                  className="bg-irish-gold hover:bg-irish-gold/90 text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow border-2 border-irish-red transition-colors"
                >
                  <a href="tel:+35314907727">Book a Table: (01) 490 7727</a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={featuredEvent ? getEventImageUrl(featuredEvent.image_url) : "/darcy-uploads/bar-img1.jpg"}
                  alt={featuredEvent ? featuredEvent.title : "Live music at D'Arcy McGee's"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
