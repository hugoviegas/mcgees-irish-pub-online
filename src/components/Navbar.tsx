import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For non-home pages, always show solid background
  // For home page, show transparent when not scrolled, solid when scrolled
  const shouldShowSolidBackground = !isHomePage || isScrolled;
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowSolidBackground
          ? "bg-irish-red shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/bar-img1.jpg"
            alt="D'Arcy McGee's pub interior"
            className="h-10 w-auto mr-3 rounded shadow-md object-cover"
          />
          <h1 className="text-xl md:text-2xl font-bold text-irish-gold font-serif">
            D'Arcy McGee's
          </h1>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link to="/" className="hover:text-irish-gold transition-colors">
            Home
          </Link>
          <Link to="/menu" className="hover:text-irish-gold transition-colors">
            Menu
          </Link>
          <Link
            to="/events"
            className="hover:text-irish-gold transition-colors"
          >
            Events
          </Link>
          <Link to="/about" className="hover:text-irish-gold transition-colors">
            About
          </Link>
        </div>

        <div className="hidden md:block">
          <Button
            asChild
            className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red"
          >
            <Link to="/reservations">Reservations</Link>
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-irish-red border-t border-irish-gold/20 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-irish-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-white hover:text-irish-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/events"
              className="text-white hover:text-irish-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-irish-gold transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Button
              asChild
              className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red"
            >
              <Link to="/reservations" onClick={() => setIsMenuOpen(false)}>
                Reservations
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
