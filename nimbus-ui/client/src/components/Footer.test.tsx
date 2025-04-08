import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock SVG path for testing
vi.mock('*.svg', () => ({
  default: () => <svg data-testid="mock-svg" />
}));

describe('Footer Component', () => {
  it('renders the copyright text correctly', () => {
    render(<Footer />);
    
    // Check if the copyright text is rendered
    const copyrightText = screen.getByText(/2025 Nimbus Playground. All rights reserved./i);
    expect(copyrightText).toBeInTheDocument();
  });
  
  it('renders the documentation link correctly', () => {
    render(<Footer />);
    
    // Check if the documentation link is rendered
    const documentationLink = screen.getByText('Documentation');
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink.closest('a')).toHaveAttribute('href', '#');
  });
  
  it('has the correct styling classes', () => {
    render(<Footer />);
    
    // Check if the footer has the correct classes
    const footer = document.querySelector('footer');
    expect(footer).toHaveClass('py-4');
    expect(footer).toHaveClass('px-6');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-gray-800');
    
    // Check if the container div has the correct classes
    const container = footer?.querySelector('div');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('justify-between');
    
    // Check if the documentation link has the correct classes
    const documentationLink = screen.getByText('Documentation').closest('a');
    expect(documentationLink).toHaveClass('text-sm');
    expect(documentationLink).toHaveClass('text-gray-500');
    expect(documentationLink).toHaveClass('hover:text-gray-300');
  });
  
  it('renders the SVG icon for documentation', () => {
    render(<Footer />);
    
    // Check if the SVG icon is rendered
    const svgIcon = document.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('h-4');
    expect(svgIcon).toHaveClass('w-4');
    
    // Instead of checking specific SVG path attributes which might be affected by mocking,
    // just verify that the SVG is present in the documentation link
    const documentationLink = screen.getByText('Documentation').closest('a');
    expect(documentationLink?.querySelector('svg')).toBeInTheDocument();
  });
});
