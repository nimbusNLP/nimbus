import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders the copyright text', () => {
    render(<Footer />);
    
    // Check if the copyright text is rendered
    expect(screen.getByText(/2025 Nimbus Playground. All rights reserved./)).toBeInTheDocument();
  });

  it('renders the documentation link', () => {
    render(<Footer />);
    
    // Find the Documentation link
    const docLink = screen.getByText('Documentation');
    
    // Verify link exists
    expect(docLink).toBeInTheDocument();
    
    // Check if the link has the correct href
    const linkElement = docLink.closest('a');
    expect(linkElement).toHaveAttribute('href', '#');
    
    // Check if the documentation icon is present
    const svgIcon = document.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
});
