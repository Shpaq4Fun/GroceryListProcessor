<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smart Grocery Sorter

Transforms messy shopping lists into sorted, aisle-ordered interactive checklists using Gemini 2.5 Pro.

View your app in AI Studio: https://ai.studio/apps/4a10b2d4-2130-4270-b5fc-5d8bde964c98

## Features

- **Smart Sorting**: Uses Gemini AI (Gemini 2.5 Pro) to categorize and sort grocery items based on a logical store layout (e.g., Produce -> Bakery -> Dairy).
- **Interactive Checklist**: Check off items as you shop.
- **Local Persistence**: Your list is saved locally, so you can close the tab and come back later.
- **Manual Input**: Add items manually or paste a full list from your notes or messages.
- **Responsive Design**: Optimized for mobile use, making it the perfect shopping companion.

## Run Locally

**Prerequisites:**
- Node.js (v18 or higher recommended)
- A Google Gemini API Key

**Setup:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Visit `http://localhost:3000` (or the port shown in your terminal).

## How to Use

1. **Paste Your List**: Copy your grocery list (from Notes, WhatsApp, etc.) and paste it into the input box.
2. **Process**: Click the sort button. The AI will categorize and order your items.
3. **Shop**: As you pick up items, tap them to check them off.
4. **Add More**: Use the "Add Item" feature to add forgotten items to specific categories.
5. **Reset**: Use the reset button to clear the list and start fresh.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini API (`@google/genai`)

## Project Structure

- `App.tsx`: The main application component handling state and layout.
- `services/geminiService.ts`: Handles communication with the Gemini API to process the grocery list.
- `components/`: UI components including `InputSection`, `GroceryList`, and `AddItemForm`.
- `constants.ts`: Defines the preferred aisle order and categories.
