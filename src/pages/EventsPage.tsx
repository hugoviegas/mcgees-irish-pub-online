
import { Button } from "@/components/ui/button";
import { Calendar, Music } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEventsData } from "../hooks/useEventsData";
import { format } from "date-fns";
import { getEventImageUrl } from "@/utils/eventImageUtils";

const EventsPage = () => {
  const { events, loading, error } = useEventsData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16">
        <main className="flex-grow">
          <section className="bg-irish-red py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">Events & Entertainment</h1>
              <p className="text-white text-xl max-w-2xl mx-auto">
                Experience the best of Irish culture and entertainment at D'Arcy McGee's.
              </p>
            </div>
          </section>
          
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <h2 className="text-3xl font-serif font-bold mb-4 text-irish-red">Upcoming Events</h2>
                <p className="text-gray-600">
                  From live music to special celebrations, there's always something happening at D'Arcy McGee's.
                  Join us for these upcoming events and experience the best of Irish hospitality.
                </p>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="space-y-8 mb-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-irish-gold max-w-5xl mx-auto" style={{ marginTop: '0', marginBottom: '0' }}>
                      <div className="flex flex-col md:flex-row min-h-[400px]">
                        <div className="md:w-1/3 h-[400px] md:h-auto">
                          <img 
                            src={getEventImageUrl(event.image_url)} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-10 flex flex-col justify-center">
                          <div className="flex items-center mb-4">
                            <div className="mr-4 bg-irish-gold/20 text-irish-gold p-3 rounded-full">
                              <Music className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-irish-red">{event.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center mb-6 text-gray-600 text-lg">
                            <span className="mr-6 flex items-center">
                              <Calendar className="h-5 w-5 mr-2" />
                              {format(new Date(event.date), "PPp")}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-8 text-lg">Add event description to display here.</p>
                          <div className="flex flex-wrap gap-6">
                            <Button asChild className="bg-irish-red hover:bg-irish-red/90 text-white text-lg px-6 py-3">
                              <a href={`tel:+35314907727`}>Reserve a Spot</a>
                            </Button>
                            <Button asChild variant="outline" className="border-irish-red text-irish-red hover:bg-irish-red hover:text-white text-lg px-6 py-3">
                              <a href={`/event/${event.id}`}>Event Details</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-serif font-bold mb-4 text-irish-red">Private Events</h3>
                <p className="text-gray-600 mb-6">
                  Looking to host a private event? D'Arcy McGee's offers private spaces for parties, 
                  corporate events, celebrations, and more. Our team will work with you to create a 
                  memorable experience for you and your guests.
                </p>
                <Button asChild className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red">
                  <a href="/contact">Enquire About Private Events</a>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default EventsPage;
