import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processGroceryList, extractTextFromImage } from './geminiService';
import { GoogleGenAI } from '@google/genai';

// Mock the module
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn(),
    Type: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING'
    },
    Schema: {},
  };
});

describe('geminiService Security Tests', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Spy on console.error but suppress output during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('processGroceryList should log generic error message without sensitive details', async () => {
    const sensitiveData = 'SENSITIVE_API_KEY_LEAKED';
    const mockGenerateContent = vi.fn().mockRejectedValue(new Error(sensitiveData));

    // Properly mock the constructor
    (GoogleGenAI as any).mockImplementation(function() {
      return {
        models: {
          generateContent: mockGenerateContent,
        },
      };
    });

    try {
      await processGroceryList('some input');
    } catch (e) {
      // Expected to throw
    }

    // Verify fix: error is logged without details
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error processing grocery list');

    // Ensure sensitive data is NOT logged
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(sensitiveData)
    );
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ message: sensitiveData })
    );
  });

  it('extractTextFromImage should log generic error message without sensitive details', async () => {
    const sensitiveData = 'SENSITIVE_IMAGE_DATA_LEAKED';
    const mockGenerateContent = vi.fn().mockRejectedValue(new Error(sensitiveData));

    (GoogleGenAI as any).mockImplementation(function() {
      return {
        models: {
          generateContent: mockGenerateContent,
        },
      };
    });

    try {
      await extractTextFromImage('base64data', 'image/jpeg');
    } catch (e) {
      // Expected to throw
    }

    // Verify fix: error is logged without details
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error extracting text from image');

    // Ensure sensitive data is NOT logged
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(sensitiveData)
    );
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ message: sensitiveData })
    );
  });
});
