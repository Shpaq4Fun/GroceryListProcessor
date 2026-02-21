
import React, { useState, useEffect, useCallback } from 'react';
import { GroceryData, GeminiGroceryResponse } from './types';
import { processGroceryList } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { GroceryList } from './components/GroceryList';
import { AlertCircle } from 'lucide-react';
import { toggleItem } from './logic';

const LOCAL_STORAGE_KEY = 'smartGroceryList_v1';

const App: React.FC = () => {
  const [data, setData] = useState<GroceryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation that it's a valid object
        if (parsed && parsed.categories) {
          setData(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load list", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } else {
      // If data is explicitly null (after a reset), we don't necessarily 
      // want to wipe it here IF handleReset already did it, 
      // but it's safer to ensure they stay in sync.
    }
  }, [data]);

  const handleProcess = async (rawText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: GeminiGroceryResponse = await processGroceryList(rawText);
      
      // Transform response to include IDs and checked state
      const processedData: GroceryData = {
        generalNotes: result.generalNotes || [],
        categories: result.categories.map((cat, catIdx) => ({
          name: cat.name,
          items: cat.items.map((item, itemIdx) => ({
            ...item,
            id: `item-${catIdx}-${itemIdx}-${Date.now()}`,
            checked: false,
          }))
        }))
      };

      setData(processedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong processing the list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItem = useCallback((itemId: string) => {
    setData((prevData) => {
      if (!prevData) return prevData;

      const newCategories = prevData.categories.map((cat) => {
        const itemIndex = cat.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return cat;
        }

        const newItems = [...cat.items];
        newItems[itemIndex] = { ...newItems[itemIndex], checked: !newItems[itemIndex].checked };

        return {
          ...cat,
          items: newItems,
        };
      });

      return { ...prevData, categories: newCategories };
    });
  }, []);

  const handleReset = () => {
    // Immediate clear for snappy mobile UX
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData(null);
    setError(null);
  };

  const handleAddItem = (itemName: string, categoryName: string) => {
    if (!data) return;

    const newItem = {
      id: `item-manual-${Date.now()}`,
      name: itemName,
      checked: false,
    };

    const existingCategoryIndex = data.categories.findIndex(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    let newCategories = [...data.categories];

    if (existingCategoryIndex > -1) {
      newCategories[existingCategoryIndex] = {
        ...newCategories[existingCategoryIndex],
        items: [...newCategories[existingCategoryIndex].items, newItem],
      };
    } else {
      newCategories.push({
        name: categoryName,
        items: [newItem],
      });
    }

    setData({ ...data, categories: newCategories });
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto p-4 md:p-6 bg-neutral-950 text-neutral-100 font-sans">
      {!data ? (
        <div className="flex flex-col h-full justify-center pt-10">
          <div className="mb-8 text-center">
             <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">
              Grocery List Processor
            </h1>
            <p className="text-neutral-500">Paste your list, we'll make it usable.</p>
          </div>
          
          <InputSection onProcess={handleProcess} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
              <div className="font-bold mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Error
              </div>
              {error}
              <button 
                onClick={() => setError(null)}
                className="block mt-2 text-xs underline opacity-70 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      ) : (
        <GroceryList 
          data={data} 
          onToggleItem={handleToggleItem} 
          onReset={handleReset} 
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
};

export default App;
