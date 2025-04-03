import { destroy } from '../destroy';
import * as deploymentUtils from '../utils/deployment';
import * as fileSystemUtils from '../utils/fileSystem';

jest.mock('../utils/deployment');
jest.mock('../utils/fileSystem');

describe('destroy', () => {
  const mockNimbusLocalStoragePath = '/mock/path';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should destroy the stack and delete the finished directory', async () => {
    jest.spyOn(deploymentUtils, 'destroyStack').mockResolvedValue();
    jest.spyOn(fileSystemUtils, 'deleteFinishedDir').mockImplementation();

    await destroy(mockNimbusLocalStoragePath);

    expect(deploymentUtils.destroyStack).toHaveBeenCalled();
    expect(fileSystemUtils.deleteFinishedDir).toHaveBeenCalled();
  });
});