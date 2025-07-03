import { MapPin, Clock, Phone, Instagram, Facebook, Map } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-irish-red pt-8 pb-4 text-white border-t border-irish-gold/30">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Logo & Social */}
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <img
            src="/darcy-uploads/logo.png"
            alt="D'Arcy McGee's"
            className="h-12 mb-2"
          />
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.instagram.com/darcymcgees_spawell?igsh=YXJ5dzN0YnN2amdv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-irish-gold"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100010199654874"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-irish-gold"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://maps.app.goo.gl/Rn5wet5ZUFnkdiPp8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps"
              className="hover:text-irish-gold"
            >
              <Map className="w-6 h-6" />
            </a>
          </div>
        </div>
        {/* Contact Info */}
        <div className="flex-1 flex flex-col md:flex-row md:justify-center md:items-center gap-8 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-irish-gold mt-1" />
            <div>
              <span className="font-semibold text-irish-gold">Address</span>
              <p className="text-gray-200 leading-tight">
                Spawell Complex
                <br />
                Wellington Ln, Templeogue
                <br />
                Dublin 6W, Dublin
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-irish-gold mt-1" />
            <div>
              <span className="font-semibold text-irish-gold">Hours</span>
              <p className="text-gray-200 leading-tight">
                Mon-Wed: 09:00-23:00
                <br />
                Thu: 09:00-23:00
                <br />
                Fri: 09:00-23:30
                <br />
                Sat: 10:00-00:30
                <br />
                Sun: 10:00-23:30
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-5 w-5 text-irish-gold mt-1" />
            <div>
              <span className="font-semibold text-irish-gold">Phone</span>
              <p className="text-gray-200 leading-tight">(01) 490 7727</p>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="flex flex-col items-center md:items-end mt-4 md:mt-0 text-xs text-gray-300">
          <span>&copy; {currentYear} D'Arcy McGee's. All rights reserved.</span>
          <div className="flex space-x-4 mt-2">
            <Link
              to="/about"
              className="hover:text-irish-gold"
            >
              About
            </Link>
            <Link
              to="/menu"
              className="hover:text-irish-gold"
            >
              Menu
            </Link>
            <Link
              to="/reservations"
              className="hover:text-irish-gold"
            >
              Reservations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
