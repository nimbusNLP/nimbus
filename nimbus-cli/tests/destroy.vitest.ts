import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { destroy } from '../src/destroy';
import * as cli from '../src/utils/cli';
import * as deployment from '../src/utils/deployment';
import * as fileSystem from '../src/utils/fileSystem';
import path from 'path';
import * as fs from 'fs';

// Mock all dependencies
vi.mock('path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/')),
  },
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('../src/utils/cli', () => ({
  shouldDestroyStack: vi.fn(),
}));

vi.mock('../src/utils/deployment', () => ({
  destroyStack: vi.fn(),
}));

vi.mock('../src/utils/fileSystem', () => ({
  deleteFinishedDir: vi.fn(),
}));

describe('destroy', () => {
  const mockNimbusLocalStoragePath = '/mock/storage/path';
  const mockCurrentDir = '/mock/current/dir';
  const mockFinishedDirPath = '/mock/storage/path/finished_dir';

  beforeEach(() => {
    // Set up process.cwd mock
    vi.spyOn(process, 'cwd').mockReturnValue(mockCurrentDir);
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should destroy stack and delete finished directory when it exists', async () => {
    // Mock functions
    vi.mocked(cli.shouldDestroyStack).mockResolvedValue(undefined);
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(deployment.destroyStack).mockResolvedValue(undefined);
    
    // Call the function
    await destroy(mockNimbusLocalStoragePath);
    
    // Verify the function calls
    expect(cli.shouldDestroyStack).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(mockFinishedDirPath);
    expect(deployment.destroyStack).toHaveBeenCalledWith(mockCurrentDir, mockFinishedDirPath);
    expect(fileSystem.deleteFinishedDir).toHaveBeenCalledWith(mockNimbusLocalStoragePath);
  });

  it('should exit early if finished directory does not exist', async () => {
    // Mock functions
    vi.mocked(cli.shouldDestroyStack).mockResolvedValue(undefined);
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');
    
    // Call the function
    await destroy(mockNimbusLocalStoragePath);
    
    // Verify the function calls
    expect(cli.shouldDestroyStack).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith(mockFinishedDirPath);
    expect(consoleSpy).toHaveBeenCalledWith('❌ There is nothing to delete.');
    expect(deployment.destroyStack).not.toHaveBeenCalled();
    expect(fileSystem.deleteFinishedDir).not.toHaveBeenCalled();
  });
});
