
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddItemFormProps {
  categories: string[];
  onAdd: (itemName: string, categoryName: string) => void;
  onClose: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ categories, onAdd, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [categoryName, setCategoryName] = useState(categories[0] || '');
  const [isNewCategory, setIsNewCategory] = useState(categories.length === 0);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isNewCategory ? newCategoryName : categoryName;
    if (itemName.trim() && finalCategory.trim()) {
      onAdd(itemName.trim(), finalCategory.trim());
      setItemName('');
      setNewCategoryName('');
      onClose();
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Add New Item</h3>
        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Item Name
          </label>
          <input
            type="text"
            autoFocus
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Greek Yogurt"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Category
          </label>
          {!isNewCategory ? (
            <div className="flex gap-2">
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsNewCategory(true)}
                className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-emerald-500 hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                New
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none transition-colors"
                required={isNewCategory}
              />
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsNewCategory(false)}
                  className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-700 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add to List
        </button>
      </form>
    </div>
  );
};
