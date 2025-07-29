import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocationSection from "../components/LocationSection";

const AboutPage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16">
        <main className="flex-grow">
          <section className="bg-irish-red py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">
                About Us
              </h1>
              <p className="text-white text-xl max-w-2xl mx-auto">
                Discover the story behind D'Arcy McGee's and what makes our
                Irish pub truly special.
              </p>
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center mb-16">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  <h2 className="text-3xl font-serif font-bold mb-6 text-irish-red">
                    Our Story
                  </h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    What began as a small neighborhood pub has grown into a
                    beloved institution, known for its warm hospitality,
                    excellent food and drinks, and vibrant entertainment.
                    Throughout our history, we've remained committed to
                    providing an authentic taste of Ireland and creating a
                    welcoming community gathering place.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Today, D'Arcy McGee's continues to honor Irish traditions
                    while embracing modern tastes. Whether you're joining us for
                    a quiet pint, a family meal, or a night of music and
                    entertainment, you'll experience the very best of Irish
                    hospitality.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img
                    src="/darcy-uploads/bar_pics/Bar and Restaurant Darcy McGee's.jpg"
                    alt="Bar and Restaurant Darcy McGee's"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>

              <div className="py-12 border-t border-gray-200">
                <h2 className="text-3xl font-serif font-bold mb-8 text-irish-red text-center">
                  Our Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-16 h-16 bg-irish-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-irish-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-3 text-irish-brown text-center">
                      Hospitality
                    </h3>
                    <p className="text-gray-600 text-center">
                      We believe in the Irish tradition of céad míle fáilte - a
                      hundred thousand welcomes. Every guest is treated like
                      family from the moment they walk through our doors.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-16 h-16 bg-irish-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-irish-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-3 text-irish-brown text-center">
                      Quality
                    </h3>
                    <p className="text-gray-600 text-center">
                      We're committed to serving the finest food and drinks.
                      From our carefully sourced ingredients to our perfectly
                      poured pints, quality is at the heart of everything we do.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-16 h-16 bg-irish-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-irish-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-3 text-irish-brown text-center">
                      Heritage
                    </h3>
                    <p className="text-gray-600 text-center">
                      We honor and celebrate Irish culture through our food,
                      music, and atmosphere. We take pride in sharing authentic
                      Irish traditions with our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-irish-red">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-serif font-bold mb-6 text-irish-gold">
                Come Visit Us
              </h2>
              <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
                Experience the warmth and hospitality of D'Arcy McGee's for
                yourself. We look forward to welcoming you soon!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red"
                >
                  <Link to="/menu">View Our Menu</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-irish-red text-irish-red hover:bg-irish-red hover:text-white"
                >
                  <Link to="/contact">Find Us</Link>
                </Button>
              </div>
            </div>
          </section>

          <LocationSection />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
