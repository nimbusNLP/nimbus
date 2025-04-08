/**
 * Tests for the file system utilities
 */

// Import the functions and mocks to test
const { 
  fs,
  path,
  ensureDirectoryExists,
  initializeModelsConfig,
  readModelsConfig,
  updateModelsConfig,
  removeModelFromConfig,
  removeModelDirectory,
  copyModelDirectory,
  deleteFinishedDir,
  writeModelFiles
} = require('./utils/fileSystem-utils');

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('File System Utilities', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  // Restore console methods after tests
  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('ensureDirectoryExists', () => {
    test('should create directory if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      ensureDirectoryExists('/path/to/dir');
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to/dir', { recursive: true });
    });

    test('should not create directory if it already exists', () => {
      fs.existsSync.mockReturnValue(true);
      ensureDirectoryExists('/path/to/dir');
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/dir');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('initializeModelsConfig', () => {
    test('should create empty config file if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      initializeModelsConfig('/path/to/config.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/path/to/config.json', '[]');
    });

    test('should not create config file if it already exists', () => {
      fs.existsSync.mockReturnValue(true);
      initializeModelsConfig('/path/to/config.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('readModelsConfig', () => {
    test('should read and parse config file', () => {
      const mockConfig = [{ modelName: 'model1', modelType: 'pre-trained', modelPathOrName: '/path/to/model', description: 'Test model' }];
      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      const result = readModelsConfig('/path/to/config.json');
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/config.json', 'utf8');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('updateModelsConfig', () => {
    test('should add new model to config', () => {
      const existingConfig = [{ modelName: 'model1' }];
      const newModel = { modelName: 'model2' };
      fs.readFileSync.mockReturnValue(JSON.stringify(existingConfig));
      updateModelsConfig('/path/to/config.json', newModel);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([...existingConfig, newModel], null, 2)
      );
    });
  });

  describe('removeModelFromConfig', () => {
    test('should remove model from config if it exists', () => {
      const existingConfig = [
        { modelName: 'model1' },
        { modelName: 'model2' },
        { modelName: 'model3' }
      ];
      fs.readFileSync.mockReturnValue(JSON.stringify(existingConfig));
      removeModelFromConfig('/path/to/config.json', 'model2');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/config.json',
        JSON.stringify([{ modelName: 'model1' }, { modelName: 'model3' }], null, 2)
      );
    });

    test('should not modify config if model does not exist', () => {
      const existingConfig = [{ modelName: 'model1' }, { modelName: 'model3' }];
      fs.readFileSync.mockReturnValue(JSON.stringify(existingConfig));
      removeModelFromConfig('/path/to/config.json', 'model2');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('removeModelDirectory', () => {
    test('should remove model directory if it exists', () => {
      fs.existsSync.mockReturnValue(true);
      removeModelDirectory('/base/dir', 'model1');
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'model1');
      expect(fs.rmSync).toHaveBeenCalledWith('/base/dir/model1', { recursive: true, force: true });
    });

    test('should log message if model directory does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      removeModelDirectory('/base/dir', 'model1');
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'model1');
      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('❌  Model directory "model1" does not exist.');
    });
  });

  describe('copyModelDirectory', () => {
    test('should copy model directory', () => {
      copyModelDirectory('/source/dir', '/dest/dir');
      expect(fs.cpSync).toHaveBeenCalledWith('/source/dir', '/dest/dir', { recursive: true });
    });

    test('should throw error if copy fails', () => {
      const error = new Error('Copy failed');
      fs.cpSync.mockImplementation(() => {
        throw error;
      });
      expect(() => copyModelDirectory('/source/dir', '/dest/dir')).toThrow(error);
      expect(console.error).toHaveBeenCalledWith('❌  Error copying model directory:', error);
    });
  });

  describe('deleteFinishedDir', () => {
    test('should delete finished_dir if it exists', () => {
      fs.existsSync.mockReturnValue(true);
      deleteFinishedDir('/base/dir');
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'finished_dir');
      expect(fs.rmSync).toHaveBeenCalledWith('/base/dir/finished_dir', { recursive: true, force: true });
    });

    test('should not attempt to delete if finished_dir does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      deleteFinishedDir('/base/dir');
      expect(path.join).toHaveBeenCalledWith('/base/dir', 'finished_dir');
      expect(fs.rmSync).not.toHaveBeenCalled();
    });
  });

  describe('writeModelFiles', () => {
    test('should write all model files to the model directory', () => {
      writeModelFiles(
        '/model/dir',
        'requirements content',
        'dockerfile content',
        'lambda function content',
        'model description'
      );
      
      // Check that each file was written
      expect(path.join).toHaveBeenCalledWith('/model/dir', 'requirements.txt');
      expect(path.join).toHaveBeenCalledWith('/model/dir', 'Dockerfile');
      expect(path.join).toHaveBeenCalledWith('/model/dir', 'lambda_function.py');
      expect(path.join).toHaveBeenCalledWith('/model/dir', 'description.txt');
      
      expect(fs.writeFileSync).toHaveBeenCalledTimes(4);
      expect(fs.writeFileSync).toHaveBeenCalledWith('/model/dir/requirements.txt', 'requirements content');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/model/dir/Dockerfile', 'dockerfile content');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/model/dir/lambda_function.py', 'lambda function content');
      expect(fs.writeFileSync).toHaveBeenCalledWith('/model/dir/description.txt', 'model description');
    });
  });
});
