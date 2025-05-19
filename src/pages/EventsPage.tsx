
import { Button } from "@/components/ui/button";
import { Calendar, Music, Heart, Users, Headphones } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  icon: "music" | "heart" | "users" | "headphones" | "calendar";
};

const EventsPage = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "Live Music: The Dublin Rogues",
      date: "May 22, 2025",
      time: "8:00 PM - 11:00 PM",
      description: "Join us for a night of traditional Irish folk music with The Dublin Rogues. Enjoy their energetic performances of classic Irish ballads, jigs, and reels that will have you dancing and singing along.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      icon: "music"
    },
    {
      id: 2,
      title: "Live Music: Celtic Whispers",
      date: "May 29, 2025",
      time: "8:00 PM - 11:00 PM",
      description: "Experience the haunting melodies and beautiful harmonies of Celtic Whispers. This talented duo combines traditional instruments with contemporary arrangements for a magical evening of Irish music.",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aXJpc2glMjBtdXNpY3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      icon: "music"
    },
    {
      id: 3,
      title: "St. Patrick's Day Celebration",
      date: "March 17, 2026",
      time: "12:00 PM - 2:00 AM",
      description: "Our biggest event of the year! Join us for a full day of Irish celebration featuring live music, traditional dance performances, special menu items, and of course, plenty of Guinness. Wear your green and celebrate with us!",
      image: "https://images.unsplash.com/photo-1553376419-ef94dc29326f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3QlMjBwYXRyaWNrJ3MlMjBkYXl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      icon: "heart"
    },
    {
      id: 4,
      title: "Irish Whiskey Tasting",
      date: "Last Thursday of every month",
      time: "7:00 PM - 9:00 PM",
      description: "Expand your whiskey knowledge with our expert-led tasting sessions. Sample premium Irish whiskeys while learning about distilling methods, flavor profiles, and the rich history behind each bottle.",
      image: "https://images.unsplash.com/photo-1582819509237-d9c5f5f1b1c1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2hpc2tleSUyMHRhc3Rpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      icon: "users"
    },
    {
      id: 5,
      title: "Traditional Irish Music Session",
      date: "Every Sunday",
      time: "4:00 PM - 7:00 PM",
      description: "Our weekly informal music session welcomes musicians of all levels to join in playing traditional Irish tunes. Bring your instrument or just come to listen and enjoy the authentic Irish atmosphere.",
      image: "https://images.unsplash.com/photo-1498038116800-4159eb9b2a62?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWNvdXN0aWMlMjBtdXNpY3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      icon: "headphones"
    },
    {
      id: 6,
      title: "Quiz Night",
      date: "Every Tuesday",
      time: "8:00 PM - 10:00 PM",
      description: "Test your knowledge with our weekly quiz night covering a variety of topics including Irish history, culture, sports, and general trivia. Form a team and compete for prizes and pub bragging rights!",
      image: "https://images.unsplash.com/photo-1606326608690-4e0281b1e588?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cXVpeiUyMG5pZ2h0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      icon: "calendar"
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "music":
        return <Music className="h-6 w-6" />;
      case "heart":
        return <Heart className="h-6 w-6" />;
      case "users":
        return <Users className="h-6 w-6" />;
      case "headphones":
        return <Headphones className="h-6 w-6" />;
      default:
        return <Calendar className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="bg-irish-green py-16">
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
              <h2 className="text-3xl font-serif font-bold mb-4 text-irish-green">Upcoming Events</h2>
              <p className="text-gray-600">
                From live music to special celebrations, there's always something happening at D'Arcy McGee's.
                Join us for these upcoming events and experience the best of Irish hospitality.
              </p>
            </div>
            
            <div className="space-y-8 mb-16">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-64 md:h-auto">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-irish-gold/20 text-irish-gold p-2 rounded-full">
                          {getIcon(event.icon)}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-irish-green">{event.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center mb-4 text-gray-600">
                        <span className="mr-4 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </span>
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{event.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button asChild className="bg-irish-green hover:bg-irish-green/90 text-white">
                          <a href={`tel:+35312345678`}>Reserve a Spot</a>
                        </Button>
                        <Button asChild variant="outline" className="border-irish-green text-irish-green hover:bg-irish-green hover:text-white">
                          <a href={`/event/${event.id}`}>Event Details</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-serif font-bold mb-4 text-irish-green">Private Events</h3>
              <p className="text-gray-600 mb-6">
                Looking to host a private event? D'Arcy McGee's offers private spaces for parties, 
                corporate events, celebrations, and more. Our team will work with you to create a 
                memorable experience for you and your guests.
              </p>
              <Button asChild className="bg-irish-gold hover:bg-irish-gold/80 text-irish-green">
                <a href="/contact">Enquire About Private Events</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;
