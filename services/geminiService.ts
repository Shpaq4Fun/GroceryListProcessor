import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiGroceryResponse } from "../types";
import { PREFERRED_AISLE_ORDER } from "../constants";

const grocerySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      description: "List of grocery categories sorted by the store layout.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the category (e.g., Dairy, Produce)" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the item" },
                quantity: { type: Type.STRING, description: "Quantity if specified (e.g., 2 bags, 1kg). Optional.", nullable: true },
                note: { type: Type.STRING, description: "Specific details about the item (e.g., 'get green ones'). Optional.", nullable: true },
              },
              required: ["name"],
            },
          },
        },
        required: ["name", "items"],
      },
    },
    generalNotes: {
      type: Type.ARRAY,
      description: "Trip-wide instructions or notes that don't fit a specific item.",
      items: { type: Type.STRING },
    },
  },
  required: ["categories", "generalNotes"],
};

export const processGroceryList = async (rawText: string): Promise<GeminiGroceryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-pro"; // Using the requested model

  const aisleOrderString = PREFERRED_AISLE_ORDER.join("\n- ");

  const prompt = `
    You are an expert grocery list organizer.
    Analyze the following unstructured text containing a shopping list or email.

    Task 1: Extract grocery items, quantities, and specific notes.
    Task 2: Categorize these items into logical aisles.
    Task 3: Sort the categories specifically in this order (if applicable):
    - ${aisleOrderString}
    
    If an item does not fit the specific categories, put it in "Other".
    
    Task 4: Extract any general trip-wide instructions (e.g., "Go before 5 PM", "Don't forget the receipt") into 'generalNotes'.
    
    Raw Text to Process:
    "${rawText}"
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: grocerySchema,
        thinkingConfig: { thinkingBudget: 2048 }, // Allow some thinking for categorization logic
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as GeminiGroceryResponse;
  } catch (error) {
    console.error("Error processing grocery list");
    throw error;
  }
};

export const extractTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const prompt = "This is a photo of a handwritten grocery list in Polish. Please extract all the items and notes from this image and return them as plain text. Do not add any extra commentary, just the list items.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Error extracting text from image");
    throw error;
  }
};
