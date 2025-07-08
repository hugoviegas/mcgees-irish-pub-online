import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminImageUploadPage = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-irish-red">
          Restricted Access
        </h2>
        <p className="text-gray-600">You must be logged in to upload images.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSuccess(null);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setSuccess(null);
    setError(null);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage
      .from("barpics")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
    setUploading(false);
    if (error) {
      setError("Error uploading image: " + error.message);
    } else {
      setSuccess("Image uploaded successfully!");
      setFile(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold mb-6 text-irish-red text-center">
        Upload Image to Gallery
      </h1>
      <form
        onSubmit={handleUpload}
        className="bg-white rounded-lg shadow p-8 flex flex-col gap-6"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-irish-gold file:text-irish-red hover:file:bg-irish-gold/80"
        />
        <Button type="submit" disabled={!file || uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default AdminImageUploadPage;
