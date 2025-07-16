import HeroSlideshow from "../components/HeroSlideshow";
import AboutSection from "../components/AboutSection";
import MenuPreview from "../components/MenuPreview";
import EventsSection from "../components/EventsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import LocationSection from "../components/LocationSection";
import CTASection from "../components/CTASection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedbackButton from "../components/FeedbackButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSlideshow />
      <EventsSection />
      <main className="space-y-24 md:space-y-32 bg-[#f8f5f2] pt-0">
        <AboutSection />
        <MenuPreview />
        <TestimonialsSection />
        <LocationSection />
        <CTASection />
      </main>
      <FeedbackButton />
      <Footer />
    </div>
  );
};

export default Index;
