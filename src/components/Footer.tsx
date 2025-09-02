import { MapPin, Clock, Phone, Instagram, Facebook, Map } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-irish-red pt-10 pb-6 text-white border-t border-irish-gold/30 text-base">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-stretch md:justify-between gap-10">
        {/* Logo & Social */}
        <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 min-w-[180px]">
          <img
            src="/darcy-uploads/darcylogoyellow.png"
            alt="D'Arcy McGee's"
            className="h-14 mb-2 drop-shadow-lg"
          />
          <div className="flex space-x-6 mt-2">
            <a
              href="https://www.instagram.com/darcymcgees_spawell?igsh=YXJ5dzN0YnN2amdv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-irish-gold"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100010199654874"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-irish-gold"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a
              href="https://maps.app.goo.gl/Rn5wet5ZUFnkdiPp8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps"
              className="hover:text-irish-gold"
            >
              <Map className="w-7 h-7" />
            </a>
          </div>
        </div>
        {/* Contact Info */}
        <div className="flex-1 flex flex-col md:flex-row md:justify-center md:items-center gap-10 text-lg font-medium">
          <div className="flex items-start gap-3 min-w-[200px]">
            <MapPin className="h-6 w-6 text-irish-gold mt-1" />
            <div>
              <span className="font-bold text-irish-gold text-lg">Address</span>
              <p className="text-gray-200 leading-tight text-base">
                Spawell Complex
                <br />
                Wellington Ln, Templeogue
                <br />
                Dublin 6W, Dublin
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-[200px]">
            <Clock className="h-6 w-6 text-irish-gold mt-1" />
            <div>
              <span className="font-bold text-irish-gold text-lg">Hours</span>
              <p className="text-gray-200 leading-tight text-base">
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
          <div className="flex items-start gap-3 min-w-[180px]">
            <Phone className="h-6 w-6 text-irish-gold mt-1" />
            <div>
              <span className="font-bold text-irish-gold text-lg">Phone</span>
              <p className="text-gray-200 leading-tight text-base">
                (01) 490 7727
              </p>
            </div>
          </div>
        </div>
        {/* Navigation & Copyright */}
        <div className="flex flex-col items-center md:items-end justify-between min-w-[180px] gap-4">
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex space-x-6 text-base font-medium">
              <Link to="/about" className="hover:text-irish-gold">
                About
              </Link>
              <Link to="/menu" className="hover:text-irish-gold">
                Menu
              </Link>
              <Link to="/reservations" className="hover:text-irish-gold">
                Reservations
              </Link>
            </div>
          </div>
          <span className="text-xs text-gray-300 mt-2">
            &copy; {currentYear} D'Arcy McGee's. All rights reserved.
          </span>
          <span className="text-[10px] md:text-xs text-gray-400">
            Developed by {""}
            <a
              href="https://hugoviegas.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-irish-gold"
            >
              Hugo Viegas
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
