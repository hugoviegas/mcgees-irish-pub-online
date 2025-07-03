import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-irish-red pt-8 pb-4 text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-4">
          {/* Brand & Social */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-xl font-serif font-bold text-irish-gold mb-1">
              D'Arcy McGee's
            </h3>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=100010199654874"
                aria-label="Facebook"
                className="text-white hover:text-irish-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Facebook Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/darcymcgees_spawell?igsh=YXJ5dzN0YnN2amdv"
                aria-label="Instagram"
                className="text-white hover:text-irish-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Instagram Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://maps.app.goo.gl/Rn5wet5ZUFnkdiPp8"
                aria-label="Google Maps"
                className="text-white hover:text-irish-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Map Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-2 min-w-[220px]">
            <h4 className="text-base font-serif font-semibold text-irish-gold mb-1">
              Contact
            </h4>
            <div className="text-gray-200">
              <div>
                <span className="font-medium text-white">Address:</span> Spawell
                Complex, Wellington Ln, Templeogue, Dublin 6W, Dublin
              </div>
              <div>
                <span className="font-medium text-white">Opening Hours:</span>
                <span className="block ml-2">
                  Mon-Wed: 09:00 - 23:00
                  <br />
                  Thu: 09:00 - 23:00
                  <br />
                  Fri: 09:00 - 23:30
                  <br />
                  Sat: 10:00 - 00:30
                  <br />
                  Sun: 10:00 - 23:30
                </span>
              </div>
              <div>
                <span className="font-medium text-white">Phone:</span>{" "}
                <a
                  href="tel:+35314907727"
                  className="hover:underline text-irish-gold"
                >
                  (01) 490 7727
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-irish-gold/20 pt-4 mt-2 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-300">
            &copy; {currentYear} D'Arcy McGee's. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link
              to="/about"
              className="text-xs text-gray-300 hover:text-irish-gold"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-xs text-gray-300 hover:text-irish-gold"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-gray-300 hover:text-irish-gold"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
