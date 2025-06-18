import { useState } from "react";
import { useEventsData } from "../hooks/useEventsData";
import { Event } from "../types/events";
import { EventForm } from "../components/admin/EventForm";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { format } from "date-fns";

export default function AdminEventsPage() {
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEventsData();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Events</h1>

      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <EventForm
            onSubmit={async (data) => {
              if (editingEvent) {
                await updateEvent(editingEvent.id, data);
                setEditingEvent(null);
              } else {
                await addEvent(data);
              }
            }}
            initialData={
              editingEvent
                ? {
                    title: editingEvent.title,
                    date: editingEvent.date,
                    image_url: editingEvent.image_url || "",
                  }
                : undefined
            }
            submitLabel={editingEvent ? "Update Event" : "Add Event"}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Events</h2>
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.date), "PPpp")}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingEvent(event)}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
