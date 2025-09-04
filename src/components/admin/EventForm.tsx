import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { EventFormData } from "../../types/events";
import { useToast } from "../../hooks/use-toast";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: EventFormData;
  submitLabel?: string;
  onCancel: () => void;
}

export function EventForm({
  onSubmit,
  initialData,
  submitLabel = "Add Event",
  onCancel,
}: EventFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: "",
      date: "",
      image_url: "",
      is_month_poster: false,
    }
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If poster-only, require image_url
    if (formData.is_month_poster && !formData.image_url) {
      toast({
        title: "Error",
        description: "Please provide an image for the Month Poster",
        variant: "destructive",
      });
      return;
    }
    // If not poster-only, require title and date
    if (!formData.is_month_poster && (!formData.title || !formData.date)) {
      toast({
        title: "Error",
        description: "Please provide a title and date for the event",
        variant: "destructive",
      });
      return;
    }
    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: `Event successfully ${initialData ? "updated" : "added"}`,
      });
      onCancel(); // Close the popup after successful submission
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `events/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("barpics")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        setImageError("Error uploading image: " + error.message);
      } else {
        const { data } = supabase.storage
          .from("barpics")
          .getPublicUrl(fileName);
        setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
      }
    } catch (err) {
      setImageError("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{initialData ? "Edit Event" : "Add New Event"}</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date and Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Event Image
              </label>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Event preview"
                  className="mb-2 max-h-32 rounded object-cover"
                />
              )}
              <div className="flex gap-2 items-center">
                <Input
                  value={formData.image_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block"
                />
              </div>
              {uploadingImage && (
                <span className="text-xs text-gray-500 mt-1">Uploading...</span>
              )}
              {imageError && (
                <span className="text-xs text-red-500 mt-1">{imageError}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isPoster"
                type="checkbox"
                checked={!!formData.is_month_poster}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_month_poster: e.target.checked,
                  }))
                }
              />
              <label htmlFor="isPoster" className="text-sm">
                Month Poster (displayed at top of Events page)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-irish-red hover:bg-irish-red/90"
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
