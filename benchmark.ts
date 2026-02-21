/**
 * Benchmark script for toggleItem.
 *
 * To run:
 * npx tsc logic.ts benchmark.ts --target es2020 --module commonjs --esModuleInterop --skipLibCheck && node benchmark.js
 * (Note: You may need to rename .js to .cjs if type: module is set in package.json, or use ts-node)
 */
import { GroceryData } from './types';
import { toggleItem } from './logic';

function createBenchmarkData(numCategories: number, itemsPerCategory: number): GroceryData {
  const categories = [];
  for (let i = 0; i < numCategories; i++) {
    const items = [];
    for (let j = 0; j < itemsPerCategory; j++) {
      items.push({
        id: `item-${i}-${j}`,
        name: `Item ${i}-${j}`,
        checked: false
      });
    }
    categories.push({
      name: `Category ${i}`,
      items
    });
  }
  return { categories, generalNotes: [] };
}

function runBenchmark() {
  const numCategories = 500;
  const itemsPerCategory = 200;
  const data = createBenchmarkData(numCategories, itemsPerCategory);

  // Pick an item to toggle (e.g., in the middle)
  const targetCategoryIndex = Math.floor(numCategories / 2);
  const targetItemIndex = Math.floor(itemsPerCategory / 2);
  const targetItemId = `item-${targetCategoryIndex}-${targetItemIndex}`;

  console.log(`Running benchmark with ${numCategories} categories and ${itemsPerCategory} items each.`);
  console.log(`Total items: ${numCategories * itemsPerCategory}`);

  const start = process.hrtime.bigint();
  const iterations = 1000;

  // We run it multiple times against the *same* base data to measure pure function speed.
  // Although in real app we'd chain updates, for measuring the cost of one update, this is fine.
  // Actually, let's just toggle the same item repeatedly.
  let resultData = data;
  for (let i = 0; i < iterations; i++) {
    resultData = toggleItem(data, targetItemId);
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1e6; // in milliseconds

  console.log(`Total time for ${iterations} iterations: ${duration.toFixed(2)}ms`);
  console.log(`Average time per operation: ${(duration / iterations).toFixed(4)}ms`);

  // Verify reference equality behavior
  // We check the last resultData against the original data.
  // Note: if we ran it even number of times, the checked state might be back to original,
  // but object references would still be different if they were recreated.
  let changedCategories = 0;
  let unchangedCategories = 0;

  for (let i = 0; i < data.categories.length; i++) {
    if (data.categories[i] !== resultData.categories[i]) {
      changedCategories++;
    } else {
      unchangedCategories++;
    }
  }

  console.log(`Changed categories: ${changedCategories}`);
  console.log(`Unchanged categories: ${unchangedCategories}`);

  if (changedCategories === numCategories) {
      console.log("Behavior: All categories re-created (Inefficient)");
  } else if (changedCategories === 1) {
      console.log("Behavior: Only affected category re-created (Optimized)");
  } else {
      console.log(`Behavior: Unexpected (${changedCategories} changed)`);
  }
}

runBenchmark();
