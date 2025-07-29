import { useState, useEffect } from "react";

interface GoogleReview {
  author_name?: string;
  author?: string;
  text: string;
  rating: number;
  profile_photo_url: string;
  relative_time_description?: string;
}

export const useGoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocalReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const localReviews = await import("@/components/google_reviews.json");
        setReviews(localReviews.default);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchLocalReviews();
  }, []);

  return { reviews, loading, error };
};
