import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import { useEventsData } from "@/hooks/useEventsData";
import { format, isAfter, isSameDay, startOfToday } from "date-fns";
import { parseServerDate } from "@/utils/dateUtils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getEventImageUrl } from "@/utils/eventImageUtils";
import { Event as EventType } from "@/types/events";
import { useState, useEffect } from "react";

const EventsSection = () => {
  const { events, loading, error } = useEventsData();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const today = startOfToday();

  // Filter to show only upcoming events (today and later)
  const upcomingEvents = events
    ? events
        .filter((event) => {
          // Exclude month poster entries from the upcoming events list
          if (event.is_month_poster) return false;
          const eventDate = new Date(event.date);
          return isSameDay(eventDate, today) || isAfter(eventDate, today);
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // Find month poster event (first one marked as poster)
  const monthPoster = events?.find((e) => e.is_month_poster) ?? null;

  const handleSlide = (direction: "prev" | "next") => {
    if (isSliding) return;

    setIsSliding(true);

    if (direction === "prev") {
      setCurrentIndex((prev) =>
        prev > 0 ? prev - 1 : upcomingEvents.length - 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev < upcomingEvents.length - 1 ? prev + 1 : 0
      );
    }

    setTimeout(() => setIsSliding(false), 500);
  };

  const handleAddToCalendar = (event: EventType) => {
    const eventDate = new Date(event.date);
    const startDate =
      eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate =
      new Date(eventDate.getTime() + 3 * 60 * 60 * 1000)
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

  const handleShare = (event: EventType) => {
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

  if (loading) {
    return (
      <section className="py-16 wood-bg min-h-[600px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 bg-irish-gold/20 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 rounded-3xl p-8 md:p-12 animate-pulse min-h-[500px]">
              <div className="h-64 md:h-80 bg-white/20 rounded-2xl mb-6"></div>
              <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If there are no upcoming events and no poster, show the empty state
  if (error || (!upcomingEvents.length && !monthPoster)) {
    return (
      <section className="py-16 wood-bg min-h-[600px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-gold">
              Upcoming Events
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              Join us for live music, cultural events, and special promotions.
            </p>
          </div>
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
        </div>
      </section>
    );
  }

  const currentEvent = upcomingEvents[currentIndex];

  return (
    <section className="py-16 wood-bg min-h-[700px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 text-irish-gold">
            Upcoming Events
          </h2>
          <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto">
            Join us for live music, cultural events, and special promotions at
            D'Arcy McGee's Irish Pub.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Controls are rendered below with the indicators to avoid overlapping the poster */}

          {/* Two-column layout: poster left, current event right */}
          <div
            className={`transition-all duration-500 ${
              isSliding ? "opacity-80 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="grid lg:grid-cols-[minmax(260px,380px)_1fr] gap-8 bg-transparent mx-4 md:mx-8 items-center">
              {/* Left: poster (image-only) */}
              {monthPoster && (
                <div className="mb-6 lg:mb-0">
                  <div className="lg:sticky lg:top-20 flex justify-center lg:justify-start">
                    <div className="w-full max-w-full lg:max-w-[380px] mx-auto lg:mx-0">
                      <AspectRatio
                        ratio={420 / 594}
                        className="rounded-xl overflow-hidden shadow-lg border border-irish-gold/40 bg-white"
                      >
                        <img
                          src={getEventImageUrl(monthPoster.image_url)}
                          alt="Month Poster"
                          className="w-full h-full object-contain"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                </div>
              )}

              {/* Right: smaller Event Card (match Events page) */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-irish-gold/60">
                <div className="flex flex-col lg:flex-row min-h-[220px] md:min-h-[180px]">
                  <div className="lg:w-1/2 h-[160px] md:h-[180px] lg:h-auto relative group">
                    <div
                      className="h-full cursor-pointer overflow-hidden"
                      onClick={() =>
                        setExpandedImage(
                          getEventImageUrl(currentEvent.image_url)
                        )
                      }
                    >
                      <img
                        src={getEventImageUrl(currentEvent.image_url)}
                        alt={currentEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                    <div className="flex items-start mb-6">
                      <div className="mr-4 bg-irish-gold/20 text-irish-gold p-3 rounded-full flex-shrink-0">
                        <Music className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-serif font-bold text-irish-red mb-1 leading-tight">
                          {currentEvent.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-gray-600 text-sm md:text-base mb-3">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            {format(
                              parseServerDate(currentEvent.date),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            {format(
                              parseServerDate(currentEvent.date),
                              "h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base mb-3 leading-relaxed">
                      Join us for an unforgettable evening of entertainment.
                    </p>

                    <div className="flex gap-3 items-center">
                      <Button
                        asChild
                        className="bg-irish-red hover:bg-irish-red/90 text-white text-sm px-4 py-2 rounded-full font-semibold shadow transition-all duration-200"
                      >
                        <a href="tel:+35314907727">Book Table</a>
                      </Button>

                      <button
                        onClick={() => handleShare(currentEvent)}
                        className="flex items-center gap-2 p-2 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-all duration-200"
                        title="Share event"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(currentEvent)}
                        className="flex items-center gap-2 p-2 text-irish-gold hover:bg-irish-gold/10 rounded-full transition-all duration-200"
                        title="Add to calendar"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Add to Calendar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Indicators + inline arrows (centered under the card) */}
          {upcomingEvents.length > 1 && (
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => handleSlide("prev")}
                  disabled={isSliding}
                  className="bg-white/90 text-irish-red p-2 rounded-full shadow hover:scale-105 transition-all disabled:opacity-50"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2">
                  {upcomingEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-irish-gold w-8 shadow-lg"
                          : "bg-white/50 hover:bg-white/70 w-3"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleSlide("next")}
                  disabled={isSliding}
                  className="bg-white/90 text-irish-red p-2 rounded-full shadow hover:scale-105 transition-all disabled:opacity-50"
                  aria-label="Next event"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
