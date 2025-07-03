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

  // Always show solid background except on home page when not scrolled
  const shouldShowSolidBackground = !isHomePage || isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowSolidBackground ? "bg-irish-red shadow-md" : "bg-transparent"
      }`}
      style={{
        minHeight: 72,
        borderBottom: shouldShowSolidBackground ? "3px solid #f5c518" : "none",
        boxShadow: !shouldShowSolidBackground
          ? "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 0 0 rgba(0,0,0,0.12)"
          : undefined,
        backdropFilter: !shouldShowSolidBackground ? "blur(6px)" : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-[72px]">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-irish-gold font-serif tracking-tight drop-shadow-sm">
            D'Arcy McGee's
          </h1>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`transition-colors font-medium ${
              location.pathname === "/"
                ? "text-irish-gold"
                : "text-white hover:text-irish-gold"
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`transition-colors font-medium ${
              location.pathname === "/menu"
                ? "text-irish-gold"
                : "text-white hover:text-irish-gold"
            }`}
          >
            Menu
          </Link>
          <Link
            to="/events"
            className={`transition-colors font-medium ${
              location.pathname === "/events"
                ? "text-irish-gold"
                : "text-white hover:text-irish-gold"
            }`}
          >
            Events
          </Link>
          <Link
            to="/about"
            className={`transition-colors font-medium ${
              location.pathname === "/about"
                ? "text-irish-gold"
                : "text-white hover:text-irish-gold"
            }`}
          >
            About
          </Link>
        </div>
        <div className="hidden md:block ml-8">
          <Button
            asChild
            className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red font-semibold px-6 py-2 rounded-lg shadow"
          >
            <Link to="/reservations">Reservations</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none ml-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
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
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-irish-red border-t border-irish-gold/20 animate-fade-in shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={`transition-colors font-medium ${
                location.pathname === "/"
                  ? "text-irish-gold"
                  : "text-white hover:text-irish-gold"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`transition-colors font-medium ${
                location.pathname === "/menu"
                  ? "text-irish-gold"
                  : "text-white hover:text-irish-gold"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/events"
              className={`transition-colors font-medium ${
                location.pathname === "/events"
                  ? "text-irish-gold"
                  : "text-white hover:text-irish-gold"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/about"
              className={`transition-colors font-medium ${
                location.pathname === "/about"
                  ? "text-irish-gold"
                  : "text-white hover:text-irish-gold"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Button
              asChild
              className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red font-semibold px-6 py-2 rounded-lg shadow"
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
