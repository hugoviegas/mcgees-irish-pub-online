import { supabase } from "@/integrations/supabase/client";

// Função utilitária para obter a URL pública da imagem do evento do Supabase
export function getEventImageUrl(image?: string | null): string {
  if (!image) return "/darcy-uploads/bar-img1.jpg"; // Default fallback image
  
  // If it's already a full URL, just return it
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  
  // Remove any leading slashes
  const cleanImage = image.replace(/^\/+/, "");
  
  // Get the public URL from Supabase storage
  const { data } = supabase.storage.from("barpics").getPublicUrl(cleanImage);
  return data.publicUrl;
}