import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the logo and title', () => {
    render(<Header />);
    
    // Check if the title is rendered
    expect(screen.getByText('Nimbus Playground')).toBeInTheDocument();
    
    // Check if the logo container is rendered (using test-id would be better in a real app)
    const logoContainer = document.querySelector('.bg-indigo-500.rounded');
    expect(logoContainer).toBeInTheDocument();
  });

  it('renders the GitHub link with correct attributes', () => {
    render(<Header />);
    
    // Find the GitHub link
    const githubLink = screen.getByText('GitHub').closest('a');
    
    // Verify link properties
    expect(githubLink).toHaveAttribute('href', 'https://github.com/nimbusNLP');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check if the GitHub icon is present
    const githubIcon = document.querySelector('img[alt="GitHub"]');
    expect(githubIcon).toBeInTheDocument();
  });
});
