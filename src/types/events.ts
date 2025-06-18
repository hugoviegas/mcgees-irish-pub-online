export interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  date: string;
  image_url?: string;
}
