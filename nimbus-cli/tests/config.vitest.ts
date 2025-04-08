import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureApp } from '../src/utils/config';
import * as fs from 'fs';
import * as path from 'path';
import * as clack from '@clack/prompts';

// Mock dependencies
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  statSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('path', () => ({
  join: vi.fn((...args) => args.join('/')),
}));

vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  text: vi.fn(),
  outro: vi.fn(),
  isCancel: vi.fn(),
}));

describe('configureApp', () => {
  const mockCurrentDir = '/mock/current/dir';
  const mockConfigFilePath = '/mock/current/dir/nimbus-config.json';
  const mockStoragePath = '/mock/storage/path';

  beforeEach(() => {
    // Set up process.cwd mock
    vi.spyOn(process, 'cwd').mockReturnValue(mockCurrentDir);
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Default mock for path.join
    vi.mocked(path.join).mockImplementation((...args) => args.join('/'));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return existing localStorage path if config file exists and is valid', async () => {
    // Mock config file exists and contains valid data
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ localStorage: mockStoragePath }));
    
    const result = await configureApp();
    
    // Verify the function returns the existing path
    expect(result).toBe(mockStoragePath);
    expect(fs.existsSync).toHaveBeenCalledWith(mockConfigFilePath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockConfigFilePath, 'utf8');
    expect(clack.intro).not.toHaveBeenCalled();
    expect(clack.text).not.toHaveBeenCalled();
  });

  it('should prompt for a new path if config file does not exist', async () => {
    // Mock config file does not exist
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(clack.text).mockResolvedValue(mockStoragePath);
    vi.mocked(clack.isCancel).mockReturnValue(false);
    vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
    
    const result = await configureApp();
    
    // Verify the function prompts for a new path
    expect(clack.intro).toHaveBeenCalledWith('Nimbus Configuration');
    expect(clack.text).toHaveBeenCalled();
    expect(fs.statSync).toHaveBeenCalledWith(mockStoragePath);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockConfigFilePath,
      JSON.stringify({ localStorage: mockStoragePath }, null, 2)
    );
    expect(clack.outro).toHaveBeenCalledWith('Configuration complete!');
    expect(result).toBe(mockStoragePath);
  });

  it('should prompt for a new path if config file exists but is invalid', async () => {
    // Mock config file exists but contains invalid data
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('Invalid JSON');
    });
    vi.mocked(clack.text).mockResolvedValue(mockStoragePath);
    vi.mocked(clack.isCancel).mockReturnValue(false);
    vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await configureApp();
    
    // Verify the function prompts for a new path
    expect(consoleSpy).toHaveBeenCalled();
    expect(clack.intro).toHaveBeenCalledWith('Nimbus Configuration');
    expect(clack.text).toHaveBeenCalled();
    expect(result).toBe(mockStoragePath);
  });

  it('should exit if user cancels the prompt', async () => {
    // Mock config file does not exist and user cancels the prompt
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(clack.text).mockResolvedValue('some-path');
    vi.mocked(clack.isCancel).mockReturnValue(true);
    
    // Mock process.exit
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    
    await configureApp();
    
    // Verify the function exits
    expect(clack.outro).toHaveBeenCalledWith(expect.stringContaining('Setup cancelled'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should retry if provided path is not a directory', async () => {
    // Mock config file does not exist
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    // Mock user input - first invalid, then valid
    vi.mocked(clack.text)
      .mockResolvedValueOnce('/invalid/path')
      .mockResolvedValueOnce(mockStoragePath);
    vi.mocked(clack.isCancel).mockReturnValue(false);
    
    // Mock fs.statSync - first not a directory, then a directory
    vi.mocked(fs.statSync)
      .mockReturnValueOnce({ isDirectory: () => false } as any)
      .mockReturnValueOnce({ isDirectory: () => true } as any);
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const result = await configureApp();
    
    // Verify the function retries
    expect(clack.text).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not a directory'));
    expect(result).toBe(mockStoragePath);
  });

  it('should retry if provided path does not exist', async () => {
    // Mock config file does not exist
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    // Mock user input - first throws error, then valid
    vi.mocked(clack.text)
      .mockResolvedValueOnce('/nonexistent/path')
      .mockResolvedValueOnce(mockStoragePath);
    vi.mocked(clack.isCancel).mockReturnValue(false);
    
    // Mock fs.statSync - first throws error, then returns valid
    vi.mocked(fs.statSync)
      .mockImplementationOnce(() => { throw new Error('Path does not exist'); })
      .mockReturnValueOnce({ isDirectory: () => true } as any);
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const result = await configureApp();
    
    // Verify the function retries
    expect(clack.text).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid path'));
    expect(result).toBe(mockStoragePath);
  });

  it('should handle errors when saving configuration', async () => {
    // Mock config file does not exist
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(clack.text).mockResolvedValue(mockStoragePath);
    vi.mocked(clack.isCancel).mockReturnValue(false);
    vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
    
    // Mock fs.writeFileSync to throw an error
    vi.mocked(fs.writeFileSync).mockImplementation(() => {
      throw new Error('Write error');
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await configureApp();
    
    // Verify the function handles the error
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error saving configuration'));
    expect(result).toBe(mockStoragePath);
  });
});
