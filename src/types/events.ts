export interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  is_month_poster?: boolean;
}

export interface EventFormData {
  title: string;
  date: string;
  image_url?: string;
  is_month_poster?: boolean;
}
