
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEventsData } from "@/hooks/useEventsData";
import { format, isAfter, isSameDay, addDays } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

const EventsSection = () => {
  const { events, loading, error } = useEventsData();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const today = new Date();
  const nextSaturday = addDays(today, (6 - today.getDay() + 7) % 7);

  // Sort events to show next upcoming event first
  const sortedEvents = events ? [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Check if dates are upcoming (same as next Saturday or after)
    const aIsUpcoming = isSameDay(dateA, nextSaturday) || isAfter(dateA, nextSaturday);
    const bIsUpcoming = isSameDay(dateB, nextSaturday) || isAfter(dateB, nextSaturday);
    
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;
    
    // Both upcoming or both past - sort by date
    return dateA.getTime() - dateB.getTime();
  }) : [];

  if (loading) {
    return (
      <section className="py-16 wood-bg">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error || !sortedEvents.length) {
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
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-700">No events available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
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

        <Carousel className="w-full max-w-6xl mx-auto" opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {sortedEvents.map((event) => (
              <CarouselItem key={event.id}>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/3 md:pr-8">
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-irish-gold mr-2" />
                        <h3 className="text-2xl font-bold font-serif text-irish-green">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {format(new Date(event.date), "PPPPp")}
                        <br />
                        {event.description || "Join us for a special event night!"}
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
                      <div 
                        className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => setExpandedImage(getEventImageUrl(event.image_url))}
                      >
                        <img
                          src={getEventImageUrl(event.image_url)}
                          alt={event.title}
                          className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-irish-gold/90 text-irish-red hover:bg-irish-gold border-irish-red" />
          <CarouselNext className="right-4 bg-irish-gold/90 text-irish-red hover:bg-irish-gold border-irish-red" />
        </Carousel>

        {/* Image expansion modal */}
        {expandedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={expandedImage}
                alt="Expanded event image"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
