import { render, screen, fireEvent } from '@testing-library/react';
import { InputSection } from './InputSection';
import { describe, it, expect, vi } from 'vitest';

describe('InputSection', () => {
  it('renders correctly', () => {
    const onProcess = vi.fn();
    render(<InputSection onProcess={onProcess} isLoading={false} />);
    expect(screen.getByText('New List')).toBeInTheDocument();
    expect(screen.getByText('Organize My List')).toBeInTheDocument();
  });

  it('displays loading state when isLoading is true', () => {
    const onProcess = vi.fn();
    const { container } = render(<InputSection onProcess={onProcess} isLoading={true} />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    // Verify Loader2 (animate-spin) is present
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('calls onProcess when submit button is clicked', () => {
    const onProcess = vi.fn();
    render(<InputSection onProcess={onProcess} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Need milk/i);
    fireEvent.change(input, { target: { value: 'Milk, Eggs' } });

    const button = screen.getByText('Organize My List');
    fireEvent.click(button);

    expect(onProcess).toHaveBeenCalledWith('Milk, Eggs');
  });
});
