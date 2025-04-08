import '@testing-library/jest-dom';

// Add any global test setup here

// This extends the expect object with methods from jest-dom
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
    }
  }
}
