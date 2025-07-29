
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')
    const PLACE_ID = "ChIJ_4mWq3ELZ0gRqk5644bi5R0"

    if (!API_KEY) {
      throw new Error('Google Maps API key not configured')
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Google API error: ${data.error_message || 'Unknown error'}`)
    }

    const reviews = data.result?.reviews || []
    
    // Filter reviews with text and rating >= 4
    const filteredReviews = reviews
      .filter((review: any) => review.text && review.rating >= 4)
      .map((review: any) => ({
        author_name: review.author_name,
        text: review.text,
        rating: review.rating,
        profile_photo_url: review.profile_photo_url || "",
        time: review.time
      }))

    return new Response(
      JSON.stringify(filteredReviews),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch reviews' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
