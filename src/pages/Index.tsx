
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import MenuPreview from "../components/MenuPreview";
import EventsSection from "../components/EventsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import LocationSection from "../components/LocationSection";
import CTASection from "../components/CTASection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <main>
        <AboutSection />
        <MenuPreview />
        <EventsSection />
        <TestimonialsSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
