/**
 * Tests for the main CLI entry point
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the modules before importing main
vi.mock('../src/deploy.js', () => ({
  deploy: vi.fn()
}));

vi.mock('../src/deleteModel.js', () => ({
  deleteModel: vi.fn()
}));

vi.mock('../src/list.js', () => ({
  listModels: vi.fn()
}));

vi.mock('../src/destroy.js', () => ({
  destroy: vi.fn()
}));

vi.mock('nimbus-ui-server', () => ({
  serveUi: vi.fn()
}));

vi.mock('../src/utils/config.js', () => ({
  configureApp: vi.fn().mockResolvedValue('/mock/path')
}));

// Import the main function and mocked modules
import { main } from '../src/main.js';
import { deploy } from '../src/deploy.js';
import { deleteModel } from '../src/deleteModel.js';
import { listModels } from '../src/list.js';
import { destroy } from '../src/destroy.js';
import { serveUi } from 'nimbus-ui-server';
import { configureApp } from '../src/utils/config.js';

describe('CLI Main', () => {
  // Save original console.log and process.argv
  const originalConsoleLog = console.log;
  const originalArgv = process.argv;
  
  beforeEach(() => {
    // Mock console.log
    console.log = vi.fn();
    
    // Reset all mocks
    vi.resetAllMocks();
    
    // Set up the configureApp mock
    (configureApp as any).mockResolvedValue('/mock/path');
  });
  
  afterEach(() => {
    // Restore original functions and values
    console.log = originalConsoleLog;
    process.argv = originalArgv;
  });
  
  it('should call deploy command when "deploy" is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'deploy'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(deploy).toHaveBeenCalledWith('/mock/path');
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUi).not.toHaveBeenCalled();
  });
  
  it('should call list command when "list" is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'list'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(listModels).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUi).not.toHaveBeenCalled();
  });
  
  it('should call delete command when "delete" is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'delete'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(deleteModel).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUi).not.toHaveBeenCalled();
  });
  
  it('should call destroy command when "destroy" is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'destroy'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(destroy).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(serveUi).not.toHaveBeenCalled();
  });
  
  it('should call serveUi command when "ui" is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'ui'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(serveUi).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Serving UI...');
  });
  
  it('should show help when no valid command is provided', async () => {
    // Arrange
    process.argv = ['node', 'main.js', 'invalid-command'];
    
    // Act
    await main();
    
    // Assert
    expect(configureApp).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Available commands:');
    expect(console.log).toHaveBeenCalledWith('  deploy - Deploy a new model');
    expect(console.log).toHaveBeenCalledWith('  list   - List all deployed models');
    expect(console.log).toHaveBeenCalledWith('  delete - Delete a model');
    expect(console.log).toHaveBeenCalledWith('  destroy - Destroy the stack');
    expect(console.log).toHaveBeenCalledWith('  ui - Serve the UI');
    
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUi).not.toHaveBeenCalled();
  });
});
