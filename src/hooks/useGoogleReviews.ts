
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleReview {
  author_name?: string;
  author?: string;
  text: string;
  rating: number;
  profile_photo_url: string;
  time?: number;
  relative_time_description?: string;
}

export const useGoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.functions.invoke('fetch-google-reviews');
        
        if (error) {
          throw error;
        }
        
        setReviews(data || []);
      } catch (err) {
        console.error('Error fetching Google reviews:', err);
        setError('Failed to load reviews');
        // Fallback to local reviews if available
        try {
          const localReviews = await import('@/components/google_reviews.json');
          setReviews(localReviews.default);
        } catch (localErr) {
          console.error('Failed to load local reviews:', localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
};
