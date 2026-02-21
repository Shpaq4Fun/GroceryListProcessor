import { describe, it, expect } from 'vitest';
import { toggleItem } from './logic';
import { GroceryData, GroceryCategory } from './types';

describe('toggleItem', () => {
  const createData = (): GroceryData => ({
    categories: [
      {
        name: 'Cat 1',
        items: [
          { id: '1', name: 'Item 1', checked: false },
          { id: '2', name: 'Item 2', checked: true },
        ]
      },
      {
        name: 'Cat 2',
        items: [
          { id: '3', name: 'Item 3', checked: false },
        ]
      }
    ],
    generalNotes: []
  });

  it('should toggle an unchecked item to checked', () => {
    const data = createData();
    const result = toggleItem(data, '1');
    expect(result.categories[0].items[0].checked).toBe(true);
  });

  it('should toggle a checked item to unchecked', () => {
    const data = createData();
    const result = toggleItem(data, '2');
    expect(result.categories[0].items[1].checked).toBe(false);
  });

  it('should not mutate original data', () => {
    const data = createData();
    const result = toggleItem(data, '1');
    expect(data.categories[0].items[0].checked).toBe(false);
    expect(result).not.toBe(data);
  });

  it('should preserve references for unchanged categories', () => {
    const data = createData();
    const result = toggleItem(data, '1'); // Item in Cat 1

    // Check that Cat 2 is the same reference
    expect(result.categories[1]).toBe(data.categories[1]);

    // Check that Cat 1 is a new reference
    expect(result.categories[0]).not.toBe(data.categories[0]);
  });

  it('should do nothing if item not found', () => {
    const data = createData();
    const result = toggleItem(data, '999');
    expect(result).toBe(data); // Should return same object if nothing changed
  });
});
