import { listModels } from '../list';
import fs from 'fs';
import path from 'path';
jest.mock('fs');
jest.mock('path');
describe('listModels', () => {
    const mockNimbusLocalStoragePath = '/mock/path';
    const mockModelsConfigPath = '/mock/path/finished_dir/models.json';
    beforeEach(() => {
        jest.clearAllMocks();
        path.join.mockReturnValue(mockModelsConfigPath);
    });
    it('should list deployed models', () => {
        const mockData = JSON.stringify([{ modelName: 'testModel', modelType: 'fine-tuned', description: 'Test description' }]);
        fs.readFileSync.mockReturnValue(mockData);
        console.log = jest.fn();
        listModels(mockNimbusLocalStoragePath);
        expect(console.log).toHaveBeenCalledWith('\nDeployed Models:');
        expect(console.log).toHaveBeenCalledWith('- testModel (fine-tuned)');
    });
    it('should handle no models deployed', () => {
        fs.readFileSync.mockImplementation(() => {
            throw { code: 'ENOENT' };
        });
        console.log = jest.fn();
        listModels(mockNimbusLocalStoragePath);
        expect(console.log).toHaveBeenCalledWith('No models deployed yet. Use "nimbus deploy" to deploy your first model.');
    });
    it('should handle errors reading the models configuration', () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('Unexpected error');
        });
        console.error = jest.fn();
        listModels(mockNimbusLocalStoragePath);
        expect(console.error).toHaveBeenCalledWith('Error reading models configuration:', expect.any(Error));
    });
});
