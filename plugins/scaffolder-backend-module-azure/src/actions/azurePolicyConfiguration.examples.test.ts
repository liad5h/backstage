/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import yaml from 'yaml';
import { ConfigReader } from '@backstage/config';
import { createAzurePolicyConfigurationAction } from './azurePolicyConfiguration';
import { ScmIntegrations } from '@backstage/integration';
import { WebApi } from 'azure-devops-node-api';
import { examples } from './azurePolicyConfiguration.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getPersonalAccessTokenHandler: jest.fn().mockReturnValue(() => {}),
}));

describe('azure:policyConfiguration:create examples', () => {
  const config = new ConfigReader({
    integrations: {
      azure: [
        {
          host: 'dev.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
        {
          host: 'test.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createAzurePolicyConfigurationAction({ integrations });
  const mockContext = createMockActionContext();

  const mockPolicyClient = {
    createPolicyConfiguration: jest.fn(),
  };
  const mockPolicyApi = {
    getPolicyApi: jest.fn().mockReturnValue(mockPolicyClient),
  };

  (WebApi as unknown as jest.Mock).mockImplementation(() => mockPolicyApi);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
      },
      isEnabled: true,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[0].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: true,
        type: {
          id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
        },
        settings: expect.objectContaining({
          statusName: 'Status Name',
          statusGenre: 'Status Genre',
          scope: [
            {
              refName: 'refs/heads/main',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[1].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
      },
      isEnabled: false,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[1].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: false,
        isBlocking: true,
        type: {
          id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
        },
        settings: expect.objectContaining({
          statusName: 'Status Name',
          statusGenre: 'Status Genre',
          invalidateOnSourceUpdate: true,
          scope: [
            {
              refName: 'refs/heads/main',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[2].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
      },
      isEnabled: true,
      isBlocking: false,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[2].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: false,
        type: {
          id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
        },
        settings: expect.objectContaining({
          statusName: 'Status Name',
          statusGenre: 'Status Genre',
          scope: [
            {
              refName: 'refs/heads/main',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[3].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
      },
      isEnabled: true,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[3].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: true,
        type: {
          id: 'cbdc66da-9728-4af8-aada-9a5a32e4a226',
        },
        settings: expect.objectContaining({
          statusName: 'Status Name',
          statusGenre: 'Status Genre',
          scope: [
            {
              refName: 'refs/heads/main',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
            {
              refName: 'refs/heads/develop',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
            {
              refName: 'refs/heads/feature/',
              matchKind: 'prefix',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[4].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
      },
      isEnabled: true,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[4].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: true,
        type: {
          id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
        },
        settings: expect.objectContaining({
          minimumApproverCount: 2,
          creatorVoteCounts: false,
          scope: [
            {
              refName: 'refs/heads/main',
              matchKind: 'exact',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[5].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: 'fd2167ab-b0be-447a-8ec8-39368250530e',
      },
      isEnabled: true,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[5].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: true,
        type: {
          id: 'fd2167ab-b0be-447a-8ec8-39368250530e',
        },
        settings: expect.objectContaining({
          minimumApproverCount: 1,
          creatorVoteCounts: true,
          requiredReviewerIds: ['azure-devops-group-id'],
          scope: [
            {
              refName: 'refs/heads/releases/',
              matchKind: 'prefix',
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });

  it(`should ${examples[6].description}`, async () => {
    mockPolicyClient.createPolicyConfiguration.mockResolvedValue({
      url: 'https://dev.azure.com/organization/project/_apis/policy/configurations/1',
      type: {
        id: '0517f88d-4ec5-4343-9d26-9930ebd53069',
      },
      isEnabled: true,
      isBlocking: true,
      id: 1,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...yaml.parse(examples[6].example).steps[0].input,
        ...{ repositoryId: 'repositoryId' },
      },
    });

    expect(mockPolicyClient.createPolicyConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        isEnabled: true,
        isBlocking: true,
        type: {
          id: '0517f88d-4ec5-4343-9d26-9930ebd53069',
        },
        settings: expect.objectContaining({
          searchBranches: [
            'refs/heads/myTestBranch',
            'refs/heads/anotherBranch',
          ],
          scope: [
            {
              repositoryId: 'repositoryId',
            },
          ],
        }),
      }),
      expect.any(String),
    );
  });
});
