
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useEventsData } from "@/hooks/useEventsData";
import { format, isAfter, isSameDay, addDays } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";
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
      <section className="py-20 wood-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-irish-gold/20 rounded-lg w-64 mx-auto"></div>
            <div className="h-4 bg-white/20 rounded-lg w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !sortedEvents.length) {
    return (
      <section className="py-20 wood-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-irish-gold">
              Upcoming Events
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
              Join us for live music, cultural events, and special promotions throughout the week.
            </p>
          </div>
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-12 text-center">
            <Calendar className="h-16 w-16 text-irish-gold mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No Events Scheduled</h3>
            <p className="text-gray-300 text-lg">Check back soon for exciting upcoming events!</p>
          </div>
        </div>
      </section>
    );
  }

  const [mainEvent, ...otherEvents] = sortedEvents;

  return (
    <section className="py-20 wood-bg overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-irish-gold">
            Upcoming Events
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
            Join us for live music, cultural events, and special promotions throughout the week.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Side Events - Left */}
          <div className="lg:w-1/4 space-y-6">
            {otherEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div
                  className="relative overflow-hidden rounded-xl mb-4 cursor-pointer"
                  onClick={() => setExpandedImage(getEventImageUrl(event.image_url))}
                >
                  <img
                    src={getEventImageUrl(event.image_url)}
                    alt={event.title}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center mb-3">
                  <Calendar className="h-4 w-4 text-irish-gold mr-2 flex-shrink-0" />
                  <h3 className="text-white font-bold text-sm leading-tight">{event.title}</h3>
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{format(new Date(event.date), "MMM d, h:mm a")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Featured Event */}
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 lg:p-12 transform hover:scale-[1.02] transition-all duration-500">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/5">
                  <div className="flex items-center mb-6">
                    <Calendar className="h-8 w-8 text-irish-gold mr-3" />
                    <h3 className="text-3xl lg:text-4xl font-bold font-serif text-white leading-tight">
                      {mainEvent.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-200">
                      <Clock className="h-5 w-5 text-irish-gold mr-3" />
                      <span className="text-lg">{format(new Date(mainEvent.date), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-gray-200">
                      <Clock className="h-5 w-5 text-irish-gold mr-3" />
                      <span className="text-lg">{format(new Date(mainEvent.date), "h:mm a")}</span>
                    </div>
                    <div className="flex items-center text-gray-200">
                      <MapPin className="h-5 w-5 text-irish-gold mr-3" />
                      <span className="text-lg">Darcy McGee's Irish Pub</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-irish-red to-irish-red/90 hover:from-irish-gold hover:to-irish-gold text-white hover:text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow-lg border-2 border-irish-gold transition-all duration-300 hover:shadow-xl"
                    >
                      <Link to="/events">View All Events</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-irish-gold to-irish-gold/90 hover:from-irish-gold/90 hover:to-irish-gold text-irish-red text-lg font-bold px-8 py-4 rounded-full shadow-lg border-2 border-irish-red transition-all duration-300 hover:shadow-xl"
                    >
                      <a href="tel:+35314907727">Book a Table</a>
                    </Button>
                  </div>
                </div>

                <div className="lg:w-2/5">
                  <div
                    className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer group"
                    onClick={() => setExpandedImage(getEventImageUrl(mainEvent.image_url))}
                  >
                    <img
                      src={getEventImageUrl(mainEvent.image_url)}
                      alt={mainEvent.title}
                      className="w-full h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-irish-gold/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Events - Right */}
          <div className="lg:w-1/4 space-y-6">
            {otherEvents.slice(2, 4).map((event, index) => (
              <div
                key={event.id}
                className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div
                  className="relative overflow-hidden rounded-xl mb-4 cursor-pointer"
                  onClick={() => setExpandedImage(getEventImageUrl(event.image_url))}
                >
                  <img
                    src={getEventImageUrl(event.image_url)}
                    alt={event.title}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center mb-3">
                  <Calendar className="h-4 w-4 text-irish-gold mr-2 flex-shrink-0" />
                  <h3 className="text-white font-bold text-sm leading-tight">{event.title}</h3>
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{format(new Date(event.date), "MMM d, h:mm a")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Events Row */}
        {otherEvents.length > 4 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {otherEvents.slice(4).map((event) => (
              <div
                key={event.id}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className="relative overflow-hidden rounded-lg mb-3 cursor-pointer"
                  onClick={() => setExpandedImage(getEventImageUrl(event.image_url))}
                >
                  <img
                    src={getEventImageUrl(event.image_url)}
                    alt={event.title}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-white font-semibold text-sm mb-2">{event.title}</h4>
                <p className="text-gray-300 text-xs">{format(new Date(event.date), "MMM d, h:mm a")}</p>
              </div>
            ))}
          </div>
        )}

        {/* Image expansion modal */}
        {expandedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={expandedImage}
                alt="Expanded event image"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm border border-white/20"
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
