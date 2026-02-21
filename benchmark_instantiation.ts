import { GoogleGenAI } from "@google/genai";

const API_KEY = "test_api_key";

async function benchmark() {
    const iterations = 5000;

    // Test 1: Repeated Instantiation (Unoptimized)
    console.log(`Starting benchmark with ${iterations} iterations...`);
    const start1 = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        // Minimal usage check to prevent optimization removal
        if (!ai) throw new Error("Failed");
    }
    const end1 = process.hrtime.bigint();
    const duration1 = Number(end1 - start1) / 1e6;
    console.log(`Repeated Instantiation: ${duration1.toFixed(2)}ms`);

    // Test 2: Single Instantiation (Optimized)
    const start2 = process.hrtime.bigint();
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    for (let i = 0; i < iterations; i++) {
        // Access variable
        if (!ai) throw new Error("Failed");
    }
    const end2 = process.hrtime.bigint();
    const duration2 = Number(end2 - start2) / 1e6;
    console.log(`Single Instantiation: ${duration2.toFixed(2)}ms`);

    if (duration2 > 0) {
        console.log(`Improvement: ${(duration1 / duration2).toFixed(2)}x faster`);
    } else {
        console.log("Single instantiation was too fast to measure accurately.");
    }
}

benchmark();
