export interface GroceryItem {
  id: string; // generated client-side after parsing
  name: string;
  quantity?: string;
  note?: string;
  checked: boolean;
}

export interface GroceryCategory {
  name: string;
  items: GroceryItem[];
}

export interface GroceryData {
  categories: GroceryCategory[];
  generalNotes: string[];
}

// For the raw response from Gemini (before we add IDs and local state)
export interface GeminiGroceryResponse {
  categories: {
    name: string;
    items: {
      name: string;
      quantity?: string;
      note?: string;
    }[];
  }[];
  generalNotes: string[];
}
