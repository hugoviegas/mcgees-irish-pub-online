
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";

const TestimonialsSection = () => {
  const { reviews, loading, error } = useGoogleReviews();

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-irish-red">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-irish-red">
            What Our Customers Say
          </h2>
          <div className="text-center text-gray-600">
            <p>Reviews are temporarily unavailable. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-irish-red">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-4">
                  {review.text}
                </p>
                <div className="flex items-center">
                  {review.profile_photo_url && (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-8 h-8 rounded-full mr-3"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-sm">{review.author_name}</h4>
                    <p className="text-xs text-gray-500">Google Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
