import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components that App uses
vi.mock('./components/Header', () => ({
  default: () => <div data-testid="mock-header">Header Component</div>
}));

vi.mock('./components/Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer Component</div>
}));

vi.mock('./components/Sandbox', () => ({
  default: () => <div data-testid="mock-sandbox">Sandbox Component</div>
}));

describe('App Component', () => {
  it('renders correctly with all child components', () => {
    render(<App />);
    
    // Check if all components are rendered
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sandbox')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
  
  it('has the correct layout structure', () => {
    render(<App />);
    
    // Check if the main container has the correct classes
    const mainContainer = screen.getByTestId('mock-sandbox').parentElement;
    expect(mainContainer).toHaveClass('flex-grow');
    expect(mainContainer).toHaveClass('container');
    
    // Check if the root div has the correct classes
    const rootDiv = mainContainer?.parentElement;
    expect(rootDiv).toHaveClass('flex');
    expect(rootDiv).toHaveClass('flex-col');
    expect(rootDiv).toHaveClass('min-h-screen');
  });
});
