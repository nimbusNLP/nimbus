import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { serveUi } from './index';

// Mock dependencies
vi.mock('express', () => {
  const mockApp = {
    use: vi.fn(),
    get: vi.fn(),
    listen: vi.fn().mockImplementation((port, callback) => {
      if (callback) callback();
      return { close: vi.fn() };
    })
  };

  // Create a mock function with the json property
  const mockExpress = vi.fn(() => mockApp) as any;
  mockExpress.json = vi.fn();
  mockExpress.static = vi.fn();
  
  return { default: mockExpress };
});

vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readFileSync: vi.fn()
    },
    existsSync: vi.fn(),
    readFileSync: vi.fn()
  };
});

vi.mock('path', () => {
  return {
    default: {
      join: vi.fn((...args: string[]) => args.join('/'))
    },
    join: vi.fn((...args: string[]) => args.join('/'))
  };
});

vi.mock('open', () => {
  return { default: vi.fn() };
});

// Import after mocking
import express from 'express';
import fs from 'fs';
import path from 'path';
import open from 'open';

describe('Server', () => {
  const mockNimbusStoragePath = '/mock/nimbus/storage';
  let mockApp: any;
  
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock process.cwd() to return a consistent path
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/current/dir');
    // Get the mock app from the express function
    mockApp = express();
    
    // Mock fs.existsSync to return true for the client build path by default
    (fs.existsSync as any).mockImplementation((filePath: string) => {
      if (filePath.includes('client/dist')) {
        return true;
      }
      return false;
    });

    // Spy on console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('serveUi function', () => {
    it('should initialize express app with JSON middleware', async () => {
      await serveUi(mockNimbusStoragePath);
      
      // Check if express was initialized
      expect(express).toHaveBeenCalled();
      expect(express.json).toHaveBeenCalled();
    });
    
    it('should set up API route for models', async () => {
      await serveUi(mockNimbusStoragePath);
      
      // Check if API route was set up
      expect(mockApp.get).toHaveBeenCalledWith('/api/models', expect.any(Function));
    });
    
    it('should check for frontend build directory', async () => {
      await serveUi(mockNimbusStoragePath);
      
      // Check if it checks for the frontend build directory
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('client/dist'));
    });
    
    it('should start the server on the specified port', async () => {
      await serveUi(mockNimbusStoragePath);
      
      // Check if server was started
      expect(mockApp.listen).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
    });
    
    it('should serve static files when client build directory exists', async () => {
      await serveUi(mockNimbusStoragePath);
      
      // Check if express.static is called
      expect(express.static).toHaveBeenCalled();
      // Check if app.use is called with the result of express.static
      expect(mockApp.use).toHaveBeenCalled();
    });

    it('should open the browser when openBrowser is true', async () => {
      // We need to modify the implementation of app.listen to call the callback
      // which will trigger the open function
      (mockApp.listen as any).mockImplementation((port: number, callback: () => void) => {
        callback();
        return { close: vi.fn() };
      });
      
      await serveUi(mockNimbusStoragePath, true);
      
      // Check if open is called with the correct URL
      expect(open).toHaveBeenCalledWith('http://localhost:3001');
    });

    it('should not open the browser when openBrowser is false', async () => {
      await serveUi(mockNimbusStoragePath, false);
      
      // Check that open is not called
      expect(open).not.toHaveBeenCalled();
    });

    it('should handle errors when client build directory does not exist', async () => {
      // Mock fs.existsSync to return false for all paths
      (fs.existsSync as any).mockReturnValue(false);
      
      await serveUi(mockNimbusStoragePath);
      
      // Check if console.error was called
      expect(console.error).toHaveBeenCalled();
      // Check if the error message contains the expected text
      const errorCall = vi.mocked(console.error).mock.calls[0][0];
      expect(errorCall).toContain('Frontend build directory not found');
    });
  });
  
  describe('API route handler', () => {
    it('should return empty array when models config does not exist', async () => {
      // Setup mock to indicate models config does not exist
      (fs.existsSync as any).mockImplementation((filePath: string) => {
        if (filePath.includes('client/dist')) {
          return true;
        }
        return !filePath.includes('models.json');
      });
      
      await serveUi(mockNimbusStoragePath);
      
      // Get the API route handler
      const routeHandler = vi.mocked(mockApp.get).mock.calls.find(
        (call: any) => call[0] === '/api/models'
      )?.[1];
      
      // Create mock request and response
      const req = {} as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as unknown as Response;
      
      // Call the route handler
      if (routeHandler) {
        routeHandler(req, res);
      }
      
      // Check if empty array was returned
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return models data when models config exists', async () => {
      // Setup mock to indicate models config exists
      (fs.existsSync as any).mockReturnValue(true);
      
      // Mock readFileSync to return a valid models config
      const mockModelsData = JSON.stringify([
        { id: 'model1', name: 'Test Model 1', modelName: 'model1' },
        { id: 'model2', name: 'Test Model 2', modelName: 'model2' }
      ]);
      
      // Also mock the CDK outputs file to avoid the API Gateway error
      const mockCdkOutputs = JSON.stringify({
        NimbusStack: {
          RestApiUrl: 'https://mock-api-gateway.com/'
        }
      });
      
      (fs.readFileSync as any).mockImplementation((path: string) => {
        if (path.includes('outputs.json')) {
          return mockCdkOutputs;
        }
        return mockModelsData;
      });
      
      await serveUi(mockNimbusStoragePath);
      
      // Get the API route handler
      const routeHandler = vi.mocked(mockApp.get).mock.calls.find(
        (call: any) => call[0] === '/api/models'
      )?.[1];
      
      // Create mock request and response
      const req = {} as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as unknown as Response;
      
      // Call the route handler
      if (routeHandler) {
        await routeHandler(req, res);
      }
      
      // Check if models data was returned with endpoints
      expect(res.json).toHaveBeenCalledWith([
        { 
          id: 'model1', 
          name: 'Test Model 1', 
          modelName: 'model1',
          endpoint: 'https://mock-api-gateway.com/model1/predict'
        },
        { 
          id: 'model2', 
          name: 'Test Model 2', 
          modelName: 'model2',
          endpoint: 'https://mock-api-gateway.com/model2/predict'
        }
      ]);
    });

    it('should handle JSON parse errors when models config is invalid', async () => {
      // Setup mock to indicate models config exists
      (fs.existsSync as any).mockReturnValue(true);
      
      // Mock readFileSync to return invalid JSON
      (fs.readFileSync as any).mockReturnValue('invalid json');
      
      await serveUi(mockNimbusStoragePath);
      
      // Get the API route handler
      const routeHandler = vi.mocked(mockApp.get).mock.calls.find(
        (call: any) => call[0] === '/api/models'
      )?.[1];
      
      // Create mock request and response
      const req = {} as Request;
      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as unknown as Response;
      
      // Call the route handler
      if (routeHandler) {
        routeHandler(req, res);
      }
      
      // Check if error status was set and empty array was returned
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
});
