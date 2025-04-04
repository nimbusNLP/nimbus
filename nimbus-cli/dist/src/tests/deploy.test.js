import { deploy } from '../deploy';
import * as deploymentUtils from '../utils/deployment';
import * as cliUtils from '../utils/cli';
import * as fileSystemUtils from '../utils/fileSystem';
jest.mock('../utils/deployment');
jest.mock('../utils/cli');
jest.mock('../utils/fileSystem');
describe('deploy', () => {
    const mockNimbusLocalStoragePath = '/mock/path';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should deploy API Gateway if no models are deployed', async () => {
        jest.spyOn(fileSystemUtils, 'readModelsConfig').mockReturnValue([]);
        jest.spyOn(cliUtils, 'shouldDeployApiGateway').mockResolvedValue(true);
        jest.spyOn(deploymentUtils, 'deployApiGateway').mockResolvedValue();
        await deploy(mockNimbusLocalStoragePath);
        expect(deploymentUtils.deployApiGateway).toHaveBeenCalled();
    });
    it('should skip API Gateway deployment if user declines', async () => {
        jest.spyOn(fileSystemUtils, 'readModelsConfig').mockReturnValue([]);
        jest.spyOn(cliUtils, 'shouldDeployApiGateway').mockResolvedValue(false);
        await deploy(mockNimbusLocalStoragePath);
        expect(deploymentUtils.deployApiGateway).not.toHaveBeenCalled();
    });
    it('should deploy a model if user agrees', async () => {
        jest.spyOn(fileSystemUtils, 'readModelsConfig').mockReturnValue([{
                modelName: 'testModel',
                modelType: 'pre-trained',
                modelPathOrName: '',
                description: ''
            }]);
        jest.spyOn(cliUtils, 'shouldDeployModel').mockResolvedValue(true);
        jest.spyOn(deploymentUtils, 'deployUpdatedStack').mockResolvedValue();
        await deploy(mockNimbusLocalStoragePath);
        expect(deploymentUtils.deployUpdatedStack).toHaveBeenCalled();
    });
    it('should not deploy a model if user declines', async () => {
        jest.spyOn(cliUtils, 'shouldDeployModel').mockResolvedValue(false);
        await deploy(mockNimbusLocalStoragePath);
        expect(deploymentUtils.deployUpdatedStack).not.toHaveBeenCalled();
    });
});
