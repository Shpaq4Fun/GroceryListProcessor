
import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { GroceryData } from '../types';
import { CategoryAccordion } from './CategoryAccordion';
import { AddItemForm } from './AddItemForm';

interface GroceryListProps {
  data: GroceryData;
  onToggleItem: (itemId: string) => void;
  onReset: () => void;
  onAddItem: (itemName: string, categoryName: string) => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({ data, onToggleItem, onReset, onAddItem }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const totalItems = data.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = data.categories.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0);
  const percentComplete = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="pb-32">
      {/* Header Stats */}
      <div className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 pb-2 mb-4 pt-1 px-1">
        <div className="flex justify-between items-end mb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Shopping List</h2>
          <span className="text-emerald-500 font-mono text-sm">{percentComplete}% Done</span>
        </div>
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* General Notes */}
      {data.generalNotes.length > 0 && (
        <div className="mb-4 p-3 bg-amber-900/20 border border-amber-900/30 rounded-lg">
          <h3 className="text-amber-500 font-bold text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Trip Notes
          </h3>
          <ul className="space-y-1">
            {data.generalNotes.map((note, idx) => (
              <li key={idx} className="text-sm text-amber-200/80">• {note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Item Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddItemForm 
            categories={data.categories.map(c => c.name)} 
            onAdd={onAddItem} 
            onClose={() => setShowAddForm(false)} 
          />
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {data.categories.map((category) => (
           category.items.length > 0 && (
            <CategoryAccordion 
              key={category.name} 
              category={category} 
              onToggleItem={onToggleItem} 
            />
           )
        ))}
      </div>
      
      {/* Empty State / All Done */}
      {totalItems === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <p className="mb-4">Your list is empty.</p>
          <button 
            onClick={onReset}
            className="text-emerald-500 font-bold border border-emerald-500/30 px-4 py-2 rounded-lg"
          >
            Start Fresh
          </button>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none z-30">
        <div className="max-w-lg mx-auto flex justify-center gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="pointer-events-auto shadow-2xl bg-white hover:bg-neutral-200 text-black px-6 py-4 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Item
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            className="pointer-events-auto shadow-2xl bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-4 rounded-full font-bold border border-neutral-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw size={18} />
            New List
          </button>
        </div>
      </div>
    </div>
  );
};
