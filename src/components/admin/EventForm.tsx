import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { EventFormData } from "../types/events";
import { useToast } from "../hooks/use-toast";

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: EventFormData;
  submitLabel?: string;
}

export function EventForm({
  onSubmit,
  initialData,
  submitLabel = "Add Event",
}: EventFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: "",
      date: "",
      image_url: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({ title: "", date: "", image_url: "" });
      }
      toast({
        title: "Success",
        description: `Event successfully ${initialData ? "updated" : "added"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date and Time
          </label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL (optional)
          </label>
          <Input
            id="image_url"
            value={formData.image_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
          />
        </div>

        <Button type="submit">{submitLabel}</Button>
      </form>
    </Card>
  );
}
