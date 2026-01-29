import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  extractMenuFromImage,
  getNextFriday,
  getTodayDate,
  ExtractedMenuItem,
} from "@/services/geminiService";
import { MenuItem, ALLERGEN_LIST } from "@/types/menu";

interface AIMenuExtractorProps {
  categoryId: string;
  onExtracted: (items: MenuItem[]) => void;
  onCancel: () => void;
}

const AIMenuExtractor: React.FC<AIMenuExtractorProps> = ({
  categoryId,
  onExtracted,
  onCancel,
}) => {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const [apiKey, setApiKey] = useState<string>(() => {
    // Prefer environment variable; fallback to sessionStorage for local testing
    return envApiKey || sessionStorage.getItem("gemini_api_key") || "";
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedMenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort allergens by number for display
  const sortedAllergens = [...ALLERGEN_LIST].sort(
    (a, b) => parseInt(a.id) - parseInt(b.id),
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExtractedItems([]);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    const keyToUse = (envApiKey || apiKey).trim();

    if (!keyToUse) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    setExtracting(true);
    setError(null);

    try {
      // Cache the API key in sessionStorage for convenience (clears when browser closes for security)
      if (!envApiKey) {
        sessionStorage.setItem("gemini_api_key", keyToUse);
      }

      const result = await extractMenuFromImage(imageFile, keyToUse);

      if (result.items.length === 0) {
        setError(
          "No menu items could be extracted from the image. Please try a clearer image.",
        );
      } else {
        setExtractedItems(result.items);
        toast.success(`Successfully extracted ${result.items.length} item(s)`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to extract menu data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setExtracting(false);
    }
  };

  const handleAllergenToggle = (itemIndex: number, allergenId: string) => {
    setExtractedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIndex) return item;
        const allergens = item.allergens.includes(allergenId)
          ? item.allergens.filter((a) => a !== allergenId)
          : [...item.allergens, allergenId];
        return { ...item, allergens };
      }),
    );
  };

  const handleConfirmItems = () => {
    if (extractedItems.length === 0) {
      toast.error("No items to add");
      return;
    }

    // Convert extracted items to MenuItem format
    // Start date (availableFrom) = today, End date (availableTo) = next Friday
    const todayDate = getTodayDate();
    const nextFriday = getNextFriday();
    const menuItems: MenuItem[] = extractedItems.map((item, index) => ({
      id: 0, // Will be assigned by the backend
      name: item.title,
      description: item.description,
      price: item.price,
      allergens: item.allergens,
      availableFrom: todayDate,
      availableTo: nextFriday,
      tags: [],
      hidden: false,
      displayOrder: index,
      images: [],
      sides: [],
      showSidesOutside: false,
    }));

    onExtracted(menuItems);
    toast.success(`${menuItems.length} item(s) ready to be added`);
  };

  const removeItem = (index: number) => {
    setExtractedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-irish-gold" />
            <h2 className="text-xl font-semibold">Add Menu Special with AI</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)] p-6">
          {/* API Key Input */}
          {!envApiKey ? (
            <div className="mb-6">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Gemini API key"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get a free API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-irish-red hover:underline"
                >
                  Google AI Studio
                </a>
                . Using Gemini 2.5 Flash (updated from deprecated 2.0 models).
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-irish-gold/40 bg-irish-gold/10 p-4">
              <p className="text-sm text-irish-brown">
                Using Gemini API key from environment variables.
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <Label>Upload Menu Special Image</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-gray-600">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </span>
              </Button>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <Label>Image Preview</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Menu preview"
                  className="max-w-full h-auto max-h-64 mx-auto"
                />
              </div>
            </div>
          )}

          {/* Extract Button */}
          {imageFile && !extractedItems.length && (
            <div className="mb-6">
              <Button
                onClick={handleExtract}
                disabled={extracting || !(envApiKey || apiKey).trim()}
                className="w-full bg-irish-gold hover:bg-irish-gold/90 text-irish-brown"
              >
                {extracting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Extract Items with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Extraction Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Extracted Items */}
          {extractedItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Extracted Items</h3>
              {extractedItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Textarea
                        value={item.title}
                        onChange={(e) =>
                          setExtractedItems((prev) =>
                            prev.map((i, idx) =>
                              idx === index
                                ? { ...i, title: e.target.value }
                                : i,
                            ),
                          )
                        }
                        placeholder="Item name"
                        className="mb-2 text-sm"
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          setExtractedItems((prev) =>
                            prev.map((i, idx) =>
                              idx === index
                                ? { ...i, description: e.target.value }
                                : i,
                            ),
                          )
                        }
                        placeholder="Item description"
                        className="mb-2 text-sm"
                      />
                      <Input
                        value={item.price}
                        onChange={(e) =>
                          setExtractedItems((prev) =>
                            prev.map((i, idx) =>
                              idx === index
                                ? { ...i, price: e.target.value }
                                : i,
                            ),
                          )
                        }
                        placeholder="Price (e.g., €14.95)"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Allergens */}
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Allergens:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sortedAllergens.map((allergen) => (
                        <div
                          key={allergen.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`allergen-${index}-${allergen.id}`}
                            checked={item.allergens.includes(allergen.id)}
                            onCheckedChange={() =>
                              handleAllergenToggle(index, allergen.id)
                            }
                          />
                          <Label
                            htmlFor={`allergen-${index}-${allergen.id}`}
                            className="text-sm"
                          >
                            {allergen.id}. {allergen.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setExtractedItems([]);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="flex-1"
                >
                  Start Over
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmItems}
                  className="flex-1 bg-irish-red hover:bg-irish-red/90"
                >
                  Add {extractedItems.length} Item(s)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMenuExtractor;
