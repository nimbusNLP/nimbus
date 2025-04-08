import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock the SVG import
vi.mock('../assets/github.svg', () => ({
  default: 'github-icon-mock'
}));

describe('Header Component', () => {
  it('renders the logo and title correctly', () => {
    render(<Header />);
    
    // Check if the title is rendered
    expect(screen.getByText('Nimbus Playground')).toBeInTheDocument();
    
    // Check if the logo container is rendered
    const logoContainer = document.querySelector('.w-8.h-8.bg-indigo-500.rounded');
    expect(logoContainer).toBeInTheDocument();
    
    // Check if the inner logo element is rendered
    const innerLogo = document.querySelector('.w-4.h-4.bg-white.rounded-sm');
    expect(innerLogo).toBeInTheDocument();
  });
  
  it('renders the GitHub link correctly', () => {
    render(<Header />);
    
    // Check if the GitHub link is rendered with correct attributes
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/nimbusNLP');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check if the GitHub icon is rendered
    const githubIcon = document.querySelector('img');
    expect(githubIcon).toHaveAttribute('src', 'github-icon-mock');
    expect(githubIcon).toHaveAttribute('alt', 'GitHub');
  });
  
  it('has the correct styling classes', () => {
    render(<Header />);
    
    // Check if the header has the correct classes
    const header = document.querySelector('header');
    expect(header).toHaveClass('bg-gray-900');
    expect(header).toHaveClass('text-white');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('justify-between');
    
    // Check if the GitHub link has the correct classes
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveClass('bg-gray-800');
    expect(githubLink).toHaveClass('rounded');
    expect(githubLink).toHaveClass('hover:bg-gray-700');
  });
});
