/**
 * Tests for UI utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  displayWelcomeMessage, 
  displayCompletionMessage,
  displayDeleteWelcomeMessage,
  displayDeleteCompletionMessage
} from '../src/utils/ui';

// Mock the console.log to capture output
describe('UI Utilities', () => {
  // Spy on console.log
  let consoleLogSpy: any;

  beforeEach(() => {
    // Create a spy on console.log before each test
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks();
  });

  it('should display welcome message', () => {
    // Call the function
    displayWelcomeMessage();
    
    // Verify console.log was called at least twice (for the two parts of the message)
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('should display completion message', () => {
    // Call the function
    displayCompletionMessage();
    
    // Verify console.log was called at least twice
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('should display delete welcome message', () => {
    // Call the function
    displayDeleteWelcomeMessage();
    
    // Verify console.log was called at least twice
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('should display delete completion message', () => {
    // Call the function
    displayDeleteCompletionMessage();
    
    // Verify console.log was called at least twice
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
