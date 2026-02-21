import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as geminiService from './services/geminiService';

// Mock geminiService
vi.mock('./services/geminiService', () => ({
  processGroceryList: vi.fn(),
  extractTextFromImage: vi.fn(),
}));

// Mock lucide-react to easily find the icon
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    AlertCircle: (props: any) => <svg data-testid="alert-circle-icon" {...props} />,
  };
});

describe('App', () => {
  it('displays error message and AlertCircle icon when processing fails', async () => {
    // Setup mock to reject
    const errorMessage = 'API Error';
    vi.mocked(geminiService.processGroceryList).mockRejectedValue(new Error(errorMessage));

    render(<App />);

    // Find textarea and button
    const textarea = screen.getByPlaceholderText(/e.g. Need milk/i);
    const button = screen.getByText('Organize My List');

    // Simulate user input
    fireEvent.change(textarea, { target: { value: 'milk, eggs' } });
    fireEvent.click(button);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Verify error header
    expect(screen.getByText('Error')).toBeInTheDocument();

    // Verify AlertCircle icon is present
    const icon = screen.getByTestId('alert-circle-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-4 h-4');
  });
});
