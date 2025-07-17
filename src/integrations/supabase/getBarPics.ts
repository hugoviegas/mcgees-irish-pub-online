import { supabase } from "./client";

export interface BarPic {
  src: string;
  alt: string;
}

export async function getBarPics(): Promise<BarPic[]> {
  // Lista todos os arquivos do bucket 'barpics'
  const { data, error } = await supabase.storage
    .from("barpics")
    .list(undefined, { limit: 100 });
  if (error || !data) return [];
  // Gera URLs públicas
  return data
    .filter((file) => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
    .map((file) => ({
      src: supabase.storage.from("barpics").getPublicUrl(file.name).data
        .publicUrl,
      alt: file.name,
    }));
}
