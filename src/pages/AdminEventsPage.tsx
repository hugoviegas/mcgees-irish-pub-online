import { useState } from "react";
import { useEventsData } from "../hooks/useEventsData";
import { Event, EventFormData } from "../types/events";
import { EventForm } from "../components/admin/EventForm";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { format } from "date-fns";
import { parseServerDate } from "@/utils/dateUtils";
import { getEventImageUrl } from "@/utils/eventImageUtils";

export default function AdminEventsPage() {
  const { events, loading, error, addEvent, updateEvent, deleteEvent } =
    useEventsData();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (data: EventFormData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    } else {
      await addEvent(data);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button
          onClick={handleAddEvent}
          className="bg-irish-red hover:bg-irish-red/90"
        >
          Add New Event
        </Button>
      </div>

      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold mb-4">Current Events</h2>
        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">
              No events found. Create your first event!
            </p>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={getEventImageUrl(event.image_url)}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {format(parseServerDate(event.date), "PPpp")}
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  {event.is_month_poster && (
                    <span className="inline-block text-sm text-irish-gold mr-2">
                      Month Poster
                    </span>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleEditEvent(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <EventForm
          onSubmit={handleSubmit}
          initialData={
            editingEvent
              ? {
                  title: editingEvent.title,
                  date: editingEvent.date,
                  image_url: editingEvent.image_url || "",
                  is_month_poster: editingEvent.is_month_poster || false,
                }
              : undefined
          }
          submitLabel={editingEvent ? "Update Event" : "Add Event"}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
