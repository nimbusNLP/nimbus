/**
 * Integration tests for the Nimbus CLI application
 * 
 * These tests verify that multiple components work together correctly
 */

// Mock all dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('@clack/prompts');

// Import modules
const fs = require('fs');
const path = require('path');
const prompts = require('@clack/prompts');
const fileSystem = require('../src/utils/fileSystem.js');
const validation = require('../src/utils/validation.js');

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Import the function to test (you would replace this with your actual workflow function)
// For this example, we'll create a simple workflow function
async function deployModelWorkflow(configPath, baseDir) {
  // 1. Get model name from user
  const modelName = await prompts.text({
    message: 'Enter model name:',
    validate: (value) => validation.validModelName(value, configPath) ? true : 'Invalid model name'
  });

  // 2. Get model type from user
  const modelType = await prompts.select({
    message: 'Select model type:',
    options: [
      { value: 'pre-trained', label: 'Pre-trained model' },
      { value: 'fine-tuned', label: 'Fine-tuned model' }
    ]
  });

  // 3. Get model path or name
  const modelPathOrName = await prompts.text({
    message: modelType === 'pre-trained' 
      ? 'Enter model path:' 
      : 'Enter model name:'
  });

  // 4. Get model description
  const description = await prompts.text({
    message: 'Enter model description (optional):',
    defaultValue: ''
  });

  // 5. Create model directory
  const modelDir = path.join(baseDir, modelName);
  fileSystem.ensureDirectoryExists(modelDir);

  // 6. Update models config
  const newModel = {
    modelName,
    modelType,
    modelPathOrName,
    description
  };
  fileSystem.updateModelsConfig(configPath, newModel);

  // 7. Show success message
  prompts.note(`Model ${modelName} has been deployed successfully!`, 'Success');

  return modelName;
}

describe('Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    fs.__resetMockFileSystem();
    
    // Setup path.join mock
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Setup common mocks
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
  });

  describe('Deploy Model Workflow', () => {
    test('should successfully deploy a new model', async () => {
      // Setup mocks for user input
      prompts.text.mockResolvedValueOnce('testmodel'); // Model name
      prompts.select.mockResolvedValueOnce('pre-trained'); // Model type
      prompts.text.mockResolvedValueOnce('/path/to/model'); // Model path
      prompts.text.mockResolvedValueOnce('Test model description'); // Description
      
      // Mock validation to return true
      jest.mock('../src/utils/validation.js', () => ({
        validModelName: jest.fn().mockReturnValue(true)
      }));
      
      // Execute the workflow
      const result = await deployModelWorkflow('/path/to/config.json', '/base/dir');
      
      // Verify the result
      expect(result).toBe('testmodel');
      
      // Verify directory was created
      expect(fileSystem.ensureDirectoryExists).toHaveBeenCalledWith('/base/dir/testmodel');
      
      // Verify config was updated
      expect(fileSystem.updateModelsConfig).toHaveBeenCalledWith('/path/to/config.json', {
        modelName: 'testmodel',
        modelType: 'pre-trained',
        modelPathOrName: '/path/to/model',
        description: 'Test model description'
      });
      
      // Verify success message
      expect(prompts.note).toHaveBeenCalledWith('Model testmodel has been deployed successfully!', 'Success');
    });
  });
});
