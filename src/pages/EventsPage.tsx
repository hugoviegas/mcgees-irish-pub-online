import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Music,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEventsData } from "../hooks/useEventsData";
import { format, isAfter, isSameDay, startOfToday } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const { events, loading, error } = useEventsData();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const today = startOfToday();

  // Filter to show only upcoming events (today and later)
  const upcomingEvents = events
    ? events
        .filter((event) => {
          const eventDate = new Date(event.date);
          return isSameDay(eventDate, today) || isAfter(eventDate, today);
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const handleSlide = (direction: 'prev' | 'next') => {
    if (isSliding) return;
    
    setIsSliding(true);
    
    if (direction === 'prev') {
      setCurrentIndex((prev) => prev > 0 ? prev - 1 : upcomingEvents.length - 1);
    } else {
      setCurrentIndex((prev) => prev < upcomingEvents.length - 1 ? prev + 1 : 0);
    }
    
    setTimeout(() => setIsSliding(false), 500);
  };

  const handleAddToCalendar = (event: any) => {
    const eventDate = new Date(event.date);
    const startDate = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startDate}/${endDate}&location=${encodeURIComponent(
      "Darcy McGee's Irish Pub"
    )}&sf=true&output=xml`;
    window.open(calendarUrl, "_blank");
  };

  const handleShare = (event: any) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join us for ${event.title} at Darcy McGee's Irish Pub`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Auto-reset index if events change
  useEffect(() => {
    if (currentIndex >= upcomingEvents.length && upcomingEvents.length > 0) {
      setCurrentIndex(0);
    }
  }, [upcomingEvents.length, currentIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16">
        <main className="flex-grow">
          <section className="bg-irish-red py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">
                Events & Entertainment
              </h1>
              <p className="text-white text-xl max-w-2xl mx-auto">
                Experience the best of Irish culture and entertainment at D'Arcy
                McGee's.
              </p>
            </div>
          </section>

          <section className="py-16 wood-bg min-h-[700px] flex items-center">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 text-irish-gold">
                  Upcoming Events
                </h2>
                <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto">
                  Join us for live music, cultural events, and special promotions at D'Arcy McGee's Irish Pub.
                </p>
              </div>

              {loading ? (
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white/10 rounded-3xl p-8 md:p-12 animate-pulse min-h-[500px]">
                    <div className="h-64 md:h-80 bg-white/20 rounded-2xl mb-6"></div>
                    <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              ) : error || !upcomingEvents.length ? (
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-12 text-center min-h-[400px] flex flex-col justify-center">
                    <Calendar className="h-16 w-16 text-irish-gold mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      No Upcoming Events
                    </h3>
                    <p className="text-gray-300 text-lg">
                      Check back soon for exciting events!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {upcomingEvents.map((event, index) => (
                    <div key={event.id} className="relative max-w-7xl mx-auto">
                      {/* Event Card */}
                      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-irish-gold/80 mx-4 md:mx-8">
                        <div className="flex flex-col lg:flex-row min-h-[500px] md:min-h-[600px]">
                          {/* Event Image */}
                          <div className="lg:w-1/2 h-[300px] md:h-[400px] lg:h-auto relative group">
                            <div
                              className="h-full cursor-pointer overflow-hidden"
                              onClick={() => setExpandedImage(getEventImageUrl(event.image_url))}
                            >
                              <img
                                src={getEventImageUrl(event.image_url)}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="flex items-start mb-8">
                              <div className="mr-6 bg-irish-gold/20 text-irish-gold p-4 rounded-full flex-shrink-0">
                                <Music className="h-8 w-8 md:h-10 md:w-10" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-irish-red mb-4 leading-tight">
                                  {event.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-gray-600 text-lg md:text-xl mb-6">
                                  <span className="flex items-center">
                                    <Calendar className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                                    {format(new Date(event.date), "MMM d, yyyy")}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                                    {format(new Date(event.date), "h:mm a")}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-600 text-lg md:text-xl mb-8">
                                  <MapPin className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                                  <span>D'Arcy McGee's Irish Pub</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed">
                              Join us for an unforgettable evening of entertainment in the heart of Dublin's authentic Irish pub atmosphere.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                              <Button
                                asChild
                                className="bg-irish-red hover:bg-irish-red/90 text-white text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <a href="tel:+35314907727">Book Table</a>
                              </Button>
                            </div>

                            {/* Interactive Buttons */}
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleShare(event)}
                                className="flex items-center gap-2 p-3 md:p-4 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-all duration-300 hover:scale-105"
                                title="Share event"
                              >
                                <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                                <span className="text-sm md:text-base font-medium">Share</span>
                              </button>
                              <button
                                onClick={() => handleAddToCalendar(event)}
                                className="flex items-center gap-2 p-3 md:p-4 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-all duration-300 hover:scale-105"
                                title="Add to calendar"
                              >
                                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6" />
                                <span className="text-sm md:text-base font-medium">Add to Calendar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center max-w-2xl mx-auto mt-12">
                <h3 className="text-2xl font-serif font-bold mb-4 text-irish-gold">
                  Private Events
                </h3>
                <p className="text-gray-200 mb-6">
                  Looking to host a private event? D'Arcy McGee's offers private
                  spaces for parties, corporate events, celebrations, and more.
                  Our team will work with you to create a memorable experience
                  for you and your guests.
                </p>
                <Button
                  asChild
                  className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red"
                >
                  <a href="/contact">Enquire About Private Events</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Image Expansion Modal */}
          {expandedImage && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setExpandedImage(null)}
            >
              <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <img
                  src={expandedImage}
                  alt="Expanded event image"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setExpandedImage(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EventsPage;
