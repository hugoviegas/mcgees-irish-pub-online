
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Share2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEventsData } from "@/hooks/useEventsData";
import { format, isAfter, isSameDay, startOfToday } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";
import { useState } from "react";

const EventsSection = () => {
  const { events, loading, error } = useEventsData();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const today = startOfToday();

  // Filter to show only upcoming events (today and later)
  const upcomingEvents = events ? events.filter(event => {
    const eventDate = new Date(event.date);
    return isSameDay(eventDate, today) || isAfter(eventDate, today);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev > 0 ? prev - 1 : Math.max(0, upcomingEvents.length - 1)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev < upcomingEvents.length - 1 ? prev + 1 : 0
    );
  };

  const handleAddToCalendar = (event: any) => {
    const eventDate = new Date(event.date);
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent("Darcy McGee's Irish Pub")}&sf=true&output=xml`;
    window.open(calendarUrl, '_blank');
  };

  const handleShare = (event: any) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join us for ${event.title} at Darcy McGee's Irish Pub`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <section className="py-12 wood-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-irish-gold/20 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-48 bg-white/20 rounded-xl mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !upcomingEvents.length) {
    return (
      <section className="py-12 wood-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3 text-irish-gold">
              Upcoming Events
            </h2>
            <p className="text-gray-200 text-sm md:text-base max-w-md mx-auto">
              Join us for live music, cultural events, and special promotions.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 text-center">
            <Calendar className="h-12 w-12 text-irish-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Upcoming Events</h3>
            <p className="text-gray-300 text-sm">Check back soon for exciting events!</p>
          </div>
        </div>
      </section>
    );
  }

  const currentEvent = upcomingEvents[currentIndex];

  return (
    <section className="py-12 wood-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3 text-irish-gold">
            Upcoming Events
          </h2>
          <p className="text-gray-200 text-sm md:text-base max-w-md mx-auto">
            Join us for live music, cultural events, and special promotions.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Controls */}
          {upcomingEvents.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-irish-gold/90 hover:bg-irish-gold text-irish-red p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-irish-gold/90 hover:bg-irish-gold text-irish-red p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Event Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Event Image */}
              <div className="md:w-2/5 relative">
                <div 
                  className="h-48 md:h-full cursor-pointer group overflow-hidden"
                  onClick={() => setExpandedImage(getEventImageUrl(currentEvent.image_url))}
                >
                  <img
                    src={getEventImageUrl(currentEvent.image_url)}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="md:w-3/5 p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold font-serif text-irish-green pr-4">
                    {currentEvent.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare(currentEvent)}
                      className="p-2 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-colors"
                      title="Share event"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCalendar(currentEvent)}
                      className="p-2 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-colors"
                      title="Add to calendar"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 text-irish-gold mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {format(new Date(currentEvent.date), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 text-irish-gold mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {format(new Date(currentEvent.date), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 text-irish-gold mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base">Darcy McGee's Irish Pub</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="flex-1 bg-irish-red hover:bg-irish-red/90 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    <Link to="/events">View All Events</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-irish-gold hover:bg-irish-gold/90 text-irish-red font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    <a href="tel:+35314907727">Book Table</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Counter */}
          {upcomingEvents.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {upcomingEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-irish-gold w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image expansion modal */}
        {expandedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={expandedImage}
                alt="Expanded event image"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
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
