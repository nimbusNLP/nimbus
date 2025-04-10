/**
 * Tests for the main CLI entry point
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../src/main.js';
import { deploy } from '../src/deploy.js';
import { deleteModel } from '../src/deleteModel.js';
import { listModels } from '../src/list.js';
import { destroy } from '../src/destroy.js';
import { configureApp } from '../src/utils/config.js';

// Mock modules
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
vi.mock('../src/utils/config.js', () => ({
  configureApp: vi.fn().mockResolvedValue('/mock/path')
}));

// Create a mock for nimbus-ui-server
const serveUiMock = vi.fn();
vi.mock('nimbus-ui-server', () => ({
  serveUi: serveUiMock
}));

describe('CLI Main', () => {
  const originalConsoleLog = console.log;
  const originalArgv = process.argv;
  beforeEach(() => {
    console.log = vi.fn();
    vi.resetAllMocks();
    (configureApp as any).mockResolvedValue('/mock/path');
  });
  afterEach(() => {
    console.log = originalConsoleLog;
    process.argv = originalArgv;
  });
  it('should call deploy command when "deploy" is provided', async () => {
    process.argv = ['node', 'main.js', 'deploy'];
    await main();
    expect(configureApp).toHaveBeenCalled();
    expect(deploy).toHaveBeenCalledWith('/mock/path');
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUiMock).not.toHaveBeenCalled();
  });
  it('should call list command when "list" is provided', async () => {
    process.argv = ['node', 'main.js', 'list'];
    await main();
    expect(configureApp).toHaveBeenCalled();
    expect(listModels).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUiMock).not.toHaveBeenCalled();
  });
  it('should call delete command when "delete" is provided', async () => {
    process.argv = ['node', 'main.js', 'delete'];
    await main();
    expect(configureApp).toHaveBeenCalled();
    expect(deleteModel).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUiMock).not.toHaveBeenCalled();
  });
  it('should call destroy command when "destroy" is provided', async () => {
    process.argv = ['node', 'main.js', 'destroy'];
    await main();
    expect(configureApp).toHaveBeenCalled();
    expect(destroy).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(serveUiMock).not.toHaveBeenCalled();
  });
  it('should call serveUi command when "ui" is provided', async () => {
    process.argv = ['node', 'main.js', 'ui'];
    
    // Mock the serveUi function from the main module
    const mainModule = await import('../src/main.js');
    (mainModule as any).serveUi = serveUiMock;
    
    await main();
    expect(configureApp).toHaveBeenCalled();
    expect(serveUiMock).toHaveBeenCalledWith('/mock/path');
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Serving UI...');
  });
  it('should show help when no valid command is provided', async () => {
    process.argv = ['node', 'main.js', 'invalid-command'];
    await main();
    expect(configureApp).toHaveBeenCalled();
    
    // Check that console.log was called with the expected messages in any order
    expect(console.log).toHaveBeenCalled();
    const calls = (console.log as any).mock.calls.flat();
    expect(calls).toContain('Available commands:');
    expect(calls).toContain('  deploy  - Deploy a new model');
    expect(calls).toContain('  list    - List all deployed models');
    expect(calls).toContain('  delete  - Delete a model');
    expect(calls).toContain('  destroy - Destroy the stack');
    expect(calls).toContain('  ui      - Serve the UI');
    
    expect(deploy).not.toHaveBeenCalled();
    expect(deleteModel).not.toHaveBeenCalled();
    expect(listModels).not.toHaveBeenCalled();
    expect(destroy).not.toHaveBeenCalled();
    expect(serveUiMock).not.toHaveBeenCalled();
  });
});
