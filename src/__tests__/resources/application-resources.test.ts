import { ApplicationResources } from '../../resources/application-resources.js';
import { CoolifyClient } from '../../lib/coolify-client.js';
import { jest } from '@jest/globals';

jest.mock('../../lib/coolify-client.js');

describe('ApplicationResources', () => {
  let resources: ApplicationResources;
  let mockClient: jest.Mocked<CoolifyClient>;

  beforeEach(() => {
    mockClient = {
      listApplications: jest.fn(),
      getApplication: jest.fn(),
      createApplication: jest.fn(),
      deleteApplication: jest.fn(),
      deployApplication: jest.fn(),
    } as unknown as jest.Mocked<CoolifyClient>;

    resources = new ApplicationResources(mockClient);
  });

  describe('listApplications', () => {
    it('should return applications from the client', async () => {
      const applications = [{ uuid: 'app-1', name: 'App 1' }];
      mockClient.listApplications.mockResolvedValue(applications as any);

      const result = await resources.listApplications();

      expect(result).toEqual(applications);
      expect(mockClient.listApplications).toHaveBeenCalled();
    });
  });

  describe('getApplication', () => {
    it('should return an application from the client', async () => {
      const application = { uuid: 'app-1', name: 'App 1' } as any;
      mockClient.getApplication.mockResolvedValue(application);

      const result = await resources.getApplication('test-id');

      expect(result).toEqual(application);
      expect(mockClient.getApplication).toHaveBeenCalledWith('test-id');
    });
  });

  describe('createApplication', () => {
    it('should proxy creation to the client', async () => {
      const response = { uuid: 'created-app' };
      mockClient.createApplication.mockResolvedValue(response);

      const result = await resources.createApplication({ name: 'test-app' });

      expect(result).toEqual(response);
      expect(mockClient.createApplication).toHaveBeenCalledWith({ name: 'test-app' });
    });
  });

  describe('deleteApplication', () => {
    it('should proxy deletion to the client', async () => {
      const response = { message: 'deleted' };
      mockClient.deleteApplication.mockResolvedValue(response);

      const result = await resources.deleteApplication('test-id');

      expect(result).toEqual(response);
      expect(mockClient.deleteApplication).toHaveBeenCalledWith('test-id');
    });
  });
});
