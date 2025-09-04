import { useCallback, useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { Event, EventFormData } from "../types/events";

export function useEventsData() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select(`*`)
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (eventData: EventFormData) => {
    const { error } = await supabase.from("events").insert([eventData]);
    if (error) throw error;
    await fetchEvents();
  };

  const updateEvent = async (id: string, eventData: Partial<EventFormData>) => {
    const { error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id);
    if (error) throw error;
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
