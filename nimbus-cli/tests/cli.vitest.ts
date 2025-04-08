/**
 * Vitest version of CLI utility tests
 * This shows how your TypeScript tests would work with Vitest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the modules
vi.mock('@clack/prompts', () => {
  return {
    select: vi.fn(),
    note: vi.fn(),
    isCancel: vi.fn(),
    cancel: vi.fn()
  };
});

// Mock process.exit
const mockExit = vi.fn();
vi.stubGlobal('process', {
  ...process,
  exit: mockExit
});

// Import the mocked modules
import { select, note, isCancel, cancel } from '@clack/prompts';

// Mock the validation module
vi.mock('../src/utils/validation.js', () => {
  return {
    optionToExitApp: vi.fn()
  };
});

// Import the validation module
import { optionToExitApp } from '../src/utils/validation.js';

// Mock the file system module
vi.mock('../src/utils/fileSystem.js', () => {
  return {
    readModelsConfig: vi.fn()
  };
});

// Import the file system module
import { readModelsConfig } from '../src/utils/fileSystem.js';

// Import the functions to test
import { 
  shouldDeployModel,
  shouldRemoveModel,
  selectModelToRemove,
  shouldDestroyStack
} from '../src/utils/cli.js';

describe('CLI Utilities', () => {
  // Save original console.log
  const originalConsoleLog = console.log;
  
  beforeEach(() => {
    // Mock console.log
    console.log = vi.fn();
    
    // Reset all mocks
    vi.resetAllMocks();
    
    // Set up default mock implementations
    (select as any).mockResolvedValue('yes');
    (isCancel as any).mockImplementation((input) => input === Symbol.for('clack/cancel'));
    (readModelsConfig as any).mockReturnValue([
      { modelName: 'model1', modelType: 'pre-trained', modelPathOrName: 'path/to/model1', description: 'Test model 1' },
      { modelName: 'model2', modelType: 'fine-tuned', modelPathOrName: 'path/to/model2', description: 'Test model 2' }
    ]);
  });
  
  afterEach(() => {
    // Restore original functions
    console.log = originalConsoleLog;
  });
  
  describe('shouldDeployModel', () => {
    it('should return true when user selects yes', async () => {
      (select as any).mockResolvedValue('yes');
      
      const result = await shouldDeployModel();
      
      expect(result).toBe(true);
      expect(select).toHaveBeenCalledWith({
        message: 'Are you ready to deploy a model?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      });
    });
    
    it('should exit when user selects no', async () => {
      (select as any).mockResolvedValue('no');
      
      await shouldDeployModel();
      
      expect(console.log).toHaveBeenCalledWith('No model deployed.');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    
    it('should exit when user cancels', async () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      (select as any).mockResolvedValue(cancelSymbol);
      
      await shouldDeployModel();
      
      expect(optionToExitApp).toHaveBeenCalledWith(cancelSymbol);
    });
  });
  
  describe('shouldRemoveModel', () => {
    it('should proceed when user selects yes', async () => {
      (select as any).mockResolvedValue('yes');
      
      await shouldRemoveModel('testmodel');
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you sure you want to remove the model "testmodel"? This will delete its cloud resources.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      });
      expect(mockExit).not.toHaveBeenCalled();
    });
    
    it('should exit when user selects no', async () => {
      (select as any).mockResolvedValue('no');
      
      await shouldRemoveModel('testmodel');
      
      expect(console.log).toHaveBeenCalledWith('No model removed.');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    
    it('should exit when user cancels', async () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      (select as any).mockResolvedValue(cancelSymbol);
      
      await shouldRemoveModel('testmodel');
      
      expect(optionToExitApp).toHaveBeenCalledWith(cancelSymbol);
    });
  });
  
  describe('selectModelToRemove', () => {
    it('should return selected model', async () => {
      (select as any).mockResolvedValue('model1');
      
      const result = await selectModelToRemove('/path/to/config');
      
      expect(result).toBe('model1');
      expect(select).toHaveBeenCalled();
    });
    
    it('should exit when no models are found', async () => {
      (readModelsConfig as any).mockReturnValueOnce([]);
      
      await selectModelToRemove('/path/to/config');
      
      expect(note).toHaveBeenCalledWith('No models found in configuration to remove.', 'Error');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    
    it('should exit when user cancels', async () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      (select as any).mockResolvedValue(cancelSymbol);
      
      await selectModelToRemove('/path/to/config');
      
      expect(optionToExitApp).toHaveBeenCalledWith(cancelSymbol);
    });
  });
  
  describe('shouldDestroyStack', () => {
    it('should proceed when user selects yes', async () => {
      (select as any).mockResolvedValue('yes');
      
      await shouldDestroyStack();
      
      expect(select).toHaveBeenCalledWith({
        message: 'Are you sure you want to destroy the stack? This will delete all deployed AWS resources.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      });
      expect(mockExit).not.toHaveBeenCalled();
    });
    
    it('should exit when user selects no', async () => {
      (select as any).mockResolvedValue('no');
      
      await shouldDestroyStack();
      
      expect(console.log).toHaveBeenCalledWith('Stack not destroyed.');
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    
    it('should exit when user cancels', async () => {
      const cancelSymbol = Symbol.for('clack/cancel');
      (select as any).mockResolvedValue(cancelSymbol);
      
      await shouldDestroyStack();
      
      expect(optionToExitApp).toHaveBeenCalledWith(cancelSymbol);
    });
  });
});
