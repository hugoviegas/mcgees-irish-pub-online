/**
 * Gemini AI Service for extracting menu special information from images
 * Uses Google Gemini API (free tier) for vision + text extraction
 * Updated to use Gemini 2.5 Flash models (Gemini 2.0 models deprecated March 31, 2026)
 */

export interface ExtractedMenuItem {
  title: string;
  description: string;
  allergens: string[];
  price: string;
}

export interface ExtractionResult {
  items: ExtractedMenuItem[];
  rawResponse?: string;
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * Used for the start date (availableFrom) of menu specials
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Calculate the next Friday date (at least 7 days from current date)
 * Returns ISO date string in YYYY-MM-DD format
 */
export const getNextFriday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday

  // Calculate days until next Friday (Friday is day 5)
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;

  // Ensure the result is at least 7 days away per requirements
  if (daysUntilFriday < 7) {
    daysUntilFriday += 7;
  }

  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);

  return nextFriday.toISOString().split("T")[0];
};

/**
 * Convert a File to base64 string for API submission
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extract menu special information from an image using Gemini Vision API
 * @param imageFile - The image file to analyze
 * @param apiKey - Google Gemini API key
 * @returns Extracted menu items with title, description, allergens, and price
 */
export const extractMenuFromImage = async (
  imageFile: File,
  apiKey: string,
): Promise<ExtractionResult> => {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  const base64Image = await fileToBase64(imageFile);
  const mimeType = imageFile.type || "image/jpeg";

  const prompt = `Analyze this menu special image and extract the following information for each menu item shown. The image typically contains 2 items (weekly specials).

For each item, extract:
1. Title/Name of the dish
2. Description of the dish
3. Allergen numbers (these are numeric identifiers like 1, 2, 3, etc. that indicate allergens)
4. Price (in euros)

Return the data as a valid JSON array with objects containing these fields:
- "title": string (the dish name)
- "description": string (the dish description)
- "allergens": array of strings (the numeric allergen identifiers found, e.g., ["1", "6", "9"])
- "price": string (the price including € symbol, e.g., "€14.95")

IMPORTANT: 
- Return ONLY the JSON array, no additional text or markdown formatting.
- If you cannot find a value, use an empty string for strings or empty array for allergens.
- Look for allergen numbers which are typically shown as small numbers near the item description.

Example output format:
[{"title":"Fish & Chips","description":"Beer battered cod with hand cut chips","allergens":["1","3","6"],"price":"€14.95"}]`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    },
  };

  // Use Gemini 2.5 Flash (replaces deprecated Gemini 2.0 Flash)
  const modelId = "gemini-2.5-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.error?.message ||
      `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // Extract the text response from Gemini
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("No response received from Gemini API");
  }

  // Parse the JSON response
  try {
    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = textContent.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7);
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    const items: ExtractedMenuItem[] = JSON.parse(cleanedResponse);

    // Validate and sanitize the response
    const validatedItems = items.map((item) => ({
      title: String(item.title || "").trim(),
      description: String(item.description || "").trim(),
      allergens: Array.isArray(item.allergens)
        ? item.allergens.map((a) => String(a).trim()).filter(Boolean)
        : [],
      price: String(item.price || "").trim(),
    }));

    return {
      items: validatedItems,
      rawResponse: textContent,
    };
  } catch (parseError) {
    const errorDetails =
      parseError instanceof Error ? parseError.message : "Unknown parse error";
    throw new Error(
      `Failed to parse Gemini response (${errorDetails}): ${textContent}`,
    );
  }
};
