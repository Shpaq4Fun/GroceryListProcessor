import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { GroceryCategory, GroceryItem } from '../types';

interface CategoryAccordionProps {
  category: GroceryCategory;
  onToggleItem: (itemId: string) => void;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = React.memo(({ category, onToggleItem }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate stats
  const totalItems = category.items.length;
  const checkedItems = category.items.filter(i => i.checked).length;
  const isComplete = totalItems > 0 && totalItems === checkedItems;

  return (
    <div className="mb-2 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-neutral-800/50 active:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <h3 className={`font-bold text-base truncate ${isComplete ? 'text-neutral-500 line-through' : 'text-emerald-400'}`}>
            {category.name}
          </h3>
          <span className="text-xs text-neutral-500 font-mono px-1.5 py-0.5 bg-neutral-800 rounded-md">
            {checkedItems}/{totalItems}
          </span>
        </div>
        
        <ChevronDown
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="divide-y divide-neutral-800">
          {category.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`
                group flex items-start gap-3 p-3 cursor-pointer transition-colors
                ${item.checked ? 'bg-neutral-900/50' : 'hover:bg-neutral-800/30 bg-neutral-900'}
              `}
            >
              <div className={`
                mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all
                ${item.checked 
                  ? 'bg-neutral-700 border-neutral-700' 
                  : 'bg-neutral-800 border-neutral-600 group-hover:border-emerald-500'
                }
              `}>
                {item.checked && (
                  <Check className="w-3.5 h-3.5 text-neutral-400" strokeWidth={3} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className={`text-base font-medium leading-tight break-words ${item.checked ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
                    {item.name}
                  </span>
                  {item.quantity && (
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${item.checked ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-800 text-emerald-400'}`}>
                      {item.quantity}
                    </span>
                  )}
                </div>
                {item.note && (
                  <p className={`text-xs mt-1 italic ${item.checked ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
