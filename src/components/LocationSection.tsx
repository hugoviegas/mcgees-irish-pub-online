import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone } from "lucide-react";

const LocationSection = () => {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-red">
            Find Us
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Located in the Spawell Complex in Templeogue, we're easy to find and
            always ready to welcome you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden">
            {/* Replace with your actual Google Maps embed code */}
            <iframe
              title="D'Arcy McGee's Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.781585371465!2d-6.326178322738812!3d53.293447472273904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670b71ab9689ff%3A0x1de5e286e37a4eaa!2sD&#39;Arcy%20McGee&#39;s!5e0!3m2!1sen!2sie!4v1751320446691!5m2!1sen!2sie"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420, height: "480px" }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>

          <div className="bg-irish-red text-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-irish-gold">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-irish-gold" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-200">
                      Spawell Complex
                      <br />
                      Wellington Ln, Templeogue
                      <br />
                      Dublin 6W, Dublin
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-irish-gold" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Opening Hours</h4>
                    <p className="text-gray-200">
                      Monday - Wednesday: 09:00 - 23:00
                      <br />
                      Thursday: 09:00 - 23:00
                      <br />
                      Friday: 09:00 - 23:30
                      <br />
                      Saturday: 10:00 - 00:30
                      <br />
                      Sunday: 10:00 - 23:30
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-5 w-5 text-irish-gold" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-200">(01) 490 7727</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="w-full bg-irish-gold hover:bg-irish-gold/80 text-irish-red mt-8"
            >
              <a href="tel:+35314907727">Call Now</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
