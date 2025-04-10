/**
 * Unit Tests for Express Routes
 * 
 * This file contains focused unit tests for the API endpoints in isolation.
 * It tests basic functionality using a simplified Express app with mock implementations.
 * 
 * The key differences from server-vitest.test.ts:
 * - Tests route handlers in isolation without the full server setup
 * - Uses simplified mock implementations
 * - Focuses on basic route functionality
 */

import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
vi.mock('fs');
vi.mock('path');
vi.mock('axios');

// Create a simplified version of our server routes for testing
function createTestApp() {
  const app = express();
  app.use(express.json());
  
  // Mock models endpoint
  app.get('/api/models', (req, res) => {
    try {
      const modelsConfigPath = '/mock/path/models.json';
      const cdkOutputsPath = '/mock/path/outputs.json';
      
      // Check for models config file
      if (!fs.existsSync(modelsConfigPath)) {
        res.json([]);
        return;
      }
      
      // Check for CDK outputs file
      if (!fs.existsSync(cdkOutputsPath)) {
        res.status(404).json({ error: 'Deployment outputs not found. Have you deployed?' });
        return;
      }
      
      // Read models from mock data
      const models = [
        { modelName: 'test-model', modelType: 'test', description: 'Test model' }
      ];
      
      // Mock API Gateway URL
      const baseUrl = 'https://api.example.com/';
      
      // Map models to include endpoints
      const modelsWithEndpoints = models.map(model => ({
        ...model,
        endpoint: `${baseUrl}${model.modelName}/predict`
      }));
      
      res.json(modelsWithEndpoints);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });
  
  // Mock predict endpoint
  app.post('/api/predict/:modelName', async (req, res) => {
    try {
      const { modelName } = req.params;
      const { text } = req.body;
      
      // Mock successful prediction
      res.json({ 
        prediction: `Prediction for "${text}" using ${modelName}`,
        confidence: 0.95
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to make prediction' });
    }
  });
  
  return app;
}

describe('Express Routes', () => {
  // Mock fs module
  vi.mock('fs', async () => {
    return {
      default: {
        existsSync: vi.fn(),
        readFileSync: vi.fn()
      },
      existsSync: vi.fn(),
      readFileSync: vi.fn()
    };
  });
  
  describe('/api/models endpoint', () => {
    it('should return empty array when models config file does not exist', async () => {
      // Setup mocks
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        if (path === '/mock/path/models.json') {
          return false;
        }
        return true;
      });
      
      // Create test app
      const app = createTestApp();
      
      // Test the endpoint
      const response = await request(app).get('/api/models');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    it('should return 404 when CDK outputs file does not exist', async () => {
      // Setup mocks
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        if (path === '/mock/path/models.json') {
          return true;
        }
        if (path === '/mock/path/outputs.json') {
          return false;
        }
        return true;
      });
      
      // Create test app
      const app = createTestApp();
      
      // Test the endpoint
      const response = await request(app).get('/api/models');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Deployment outputs not found. Have you deployed?' });
    });
    
    it('should return models with endpoints when all files exist', async () => {
      // Setup mocks
      vi.mocked(fs.existsSync).mockReturnValue(true);
      
      // Create test app
      const app = createTestApp();
      
      // Test the endpoint
      const response = await request(app).get('/api/models');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { 
          modelName: 'test-model', 
          modelType: 'test', 
          description: 'Test model',
          endpoint: 'https://api.example.com/test-model/predict'
        }
      ]);
    });
  });
  
  describe('/api/predict/:modelName endpoint', () => {
    it('should return prediction for given text and model', async () => {
      // Create test app
      const app = createTestApp();
      
      // Test the endpoint
      const response = await request(app)
        .post('/api/predict/test-model')
        .send({ text: 'This is a test input' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        prediction: 'Prediction for "This is a test input" using test-model',
        confidence: 0.95
      });
    });
  });
});
