import { GroceryData } from './types';

export const toggleItem = (data: GroceryData, itemId: string): GroceryData => {
  // Find the category containing the item
  let categoryIndex = -1;
  let itemIndex = -1;

  for (let i = 0; i < data.categories.length; i++) {
    const idx = data.categories[i].items.findIndex(item => item.id === itemId);
    if (idx !== -1) {
      categoryIndex = i;
      itemIndex = idx;
      break;
    }
  }

  if (categoryIndex === -1) {
    return data;
  }

  const category = data.categories[categoryIndex];
  const item = category.items[itemIndex];

  const newCategory = {
    ...category,
    items: [
      ...category.items.slice(0, itemIndex),
      { ...item, checked: !item.checked },
      ...category.items.slice(itemIndex + 1)
    ]
  };

  const newCategories = [
    ...data.categories.slice(0, categoryIndex),
    newCategory,
    ...data.categories.slice(categoryIndex + 1)
  ];

  return { ...data, categories: newCategories };
};
