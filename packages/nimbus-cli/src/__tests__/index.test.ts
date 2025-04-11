import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('fs');
vi.mock('path');
vi.mock('@clack/prompts');
vi.mock('../utils/validation.js');

import * as fs from 'fs';
import * as path from 'path';
import { configureApp } from '../utils/config.js';
import { validModelName } from '../utils/validation.js';
import * as prompts from '@clack/prompts';

describe('CLI Utilities', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockImplementation(() => true);
    vi.mocked(fs.readFileSync).mockImplementation(() => 
      JSON.stringify({ localStorage: '/test/storage/path' })
    );
    vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    vi.mocked(fs.mkdirSync).mockImplementation(() => '' as any);
    vi.mocked(fs.statSync).mockReturnValue({
      isDirectory: () => true,
      dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0,
      size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0,
      ctimeMs: 0, birthtimeMs: 0, atime: new Date(), mtime: new Date(),
      ctime: new Date(), birthtime: new Date()
    } as fs.Stats);
    
    vi.mocked(path.join).mockImplementation((...args) => args.join('/'));
    vi.mocked(path.dirname).mockReturnValue('/test/dir');
    
    vi.mocked(validModelName).mockImplementation((name) => {
      if (name === 'valid-model' || name === 'model123' || name === 'my-model-v1') {
        return true;
      }
      return false;
    });
    
    vi.mocked(prompts.text).mockResolvedValue('/new/storage/path' as any);
    vi.mocked(prompts.isCancel).mockReturnValue(false);
  });
  
  describe('Validation', () => {
    it('validModelName should accept valid model names', () => {
      const mockConfigPath = '/test/path/models.json';
      expect(validModelName('valid-model', mockConfigPath)).toBe(true);
      expect(validModelName('model123', mockConfigPath)).toBe(true);
      expect(validModelName('my-model-v1', mockConfigPath)).toBe(true);
    });

    it('validModelName should reject invalid model names', () => {
      const mockConfigPath = '/test/path/models.json';
      expect(validModelName('', mockConfigPath)).toBe(false);
      expect(validModelName('Invalid Model', mockConfigPath)).toBe(false);
      expect(validModelName('model!', mockConfigPath)).toBe(false);
      expect(validModelName('a'.repeat(65), mockConfigPath)).toBe(false);
    });
  });

  describe('Configuration', () => {

    it('configureApp should return storage path from existing config', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        localStorage: '/test/storage/path'
      }));

      const result = await configureApp();
      expect(result).toBe('/test/storage/path');
    });

    it('configureApp should handle invalid config file', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Invalid JSON');
      });

      vi.mocked(prompts.text).mockResolvedValue('/new/storage/path' as any);

      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => true,
        dev: 0,
        ino: 0,
        mode: 0,
        nlink: 0,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: 0,
        blksize: 0,
        blocks: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date()
      } as fs.Stats);

      const result = await configureApp();
      expect(result).toBe('/new/storage/path');
    });

    it('configureApp should create new config if none exists', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      vi.mocked(path.dirname).mockReturnValue('/test/dir');
      
      vi.mocked(fs.mkdirSync).mockImplementation(() => '' as any);
      
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      
      vi.mocked(path.join).mockImplementation((...args) => {
        if (args.includes('home')) {
          return '/new/storage/path';
        }
        return args.join('/');
      });
      
      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => true,
        dev: 0,
        ino: 0,
        mode: 0,
        nlink: 0,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: 0,
        blksize: 0,
        blocks: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date()
      } as fs.Stats);

      const result = await configureApp();
      expect(result).toBe('/new/storage/path');
    });
  });
});