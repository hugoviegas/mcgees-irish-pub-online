import { supabase } from "@/integrations/supabase/client";

// Função utilitária para obter a URL pública da imagem do evento do Supabase
export function getEventImageUrl(image?: string | null | undefined): string {
  // Handle undefined, null, or empty strings
  if (!image || typeof image !== "string" || image.trim() === "") {
    return "/darcy-uploads/bar-img1.jpg"; // Default fallback image
  }

  // If it's already a full URL, just return it
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Remove any leading slashes
  const cleanImage = image.replace(/^\/+/, "").trim();

  // Validate that cleanImage is not empty after cleanup
  if (!cleanImage) {
    return "/darcy-uploads/bar-img1.jpg";
  }

  // Get the public URL from Supabase storage
  try {
    const { data } = supabase.storage.from("barpics").getPublicUrl(cleanImage);
    return data?.publicUrl || "/darcy-uploads/bar-img1.jpg";
  } catch (error) {
    console.error("Error getting event image URL:", error);
    return "/darcy-uploads/bar-img1.jpg";
  }
}
