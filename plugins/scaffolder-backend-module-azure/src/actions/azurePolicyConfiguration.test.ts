/*
 * Copyright 2021 The Backstage Authors
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
import {
  setStatusSettingsFields,
  setRequiredReviewersSettingsFields,
  setMinimumReviewersSettingsFields,
  setSearchableBranchesSettingsFields,
  // getAzureWebApi
} from './helpers';
// import { createAzurePolicyConfigurationAction } from './azurePolicyConfiguration';
import { examples } from './azurePolicyConfiguration.examples';
// import { ScmIntegrations, DefaultAzureDevOpsCredentialsProvider } from '@backstage/integration';
// import { ConfigReader } from '@backstage/config';
import { WebApi } from 'azure-devops-node-api';
// import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
// import { InputError } from '@backstage/errors';

jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getPersonalAccessTokenHandler: jest.fn().mockReturnValue(() => {}),
}));

describe('azure:policyConfiguration:create', () => {
  // const config = new ConfigReader({
  //   integrations: {
  //     azure: [
  //       {
  //         host: 'dev.azure.com',
  //         credentials: [{ personalAccessToken: 'tokenlols' }],
  //       },
  //       { host: 'myazurehostnotoken.com' },
  //     ],
  //   },
  // });

  // const integrations = ScmIntegrations.fromConfig(config);
  // const action = createAzurePolicyConfigurationAction({ integrations });
  //
  // const mockContext = createMockActionContext({
  //   input: {
  //     repoUrl: 'dev.azure.com?repo=repo&project=project&organization=org',
  //     repositoryId: 'repositoryId',
  //   },
  // });

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

  it(`test setSearchableBranchesSettingsFields`, async () => {
    const validInput = {
      policySettings: yaml.parse(examples[6].example).steps[0].input
        .policySettings,
    };
    const invalidInput = {
      policySettings: {
        searchable_branches: {
          test: 'test',
        },
      },
    };

    expect(() =>
      setSearchableBranchesSettingsFields(
        invalidInput.policySettings,
        'searchable_branches',
      ),
    ).toThrow();
    expect(
      setSearchableBranchesSettingsFields(
        validInput.policySettings,
        'invalidPolicyType',
      ),
    ).toEqual({});
  });

  it(`test setRequiredReviewersSettingsFields`, async () => {
    const validInput = {
      policySettings: yaml.parse(examples[5].example).steps[0].input
        .policySettings,
    };
    const invalidInput = {
      policySettings: {
        required_reviewers: {
          test: 'test',
        },
      },
    };

    expect(() =>
      setRequiredReviewersSettingsFields(
        invalidInput.policySettings,
        'required_reviewers',
      ),
    ).toThrow();
    expect(
      setRequiredReviewersSettingsFields(
        validInput.policySettings,
        'invalidPolicyType',
      ),
    ).toEqual({});
  });

  it(`test setMinimumReviewersSettingsFields`, async () => {
    const validInput = {
      policySettings: yaml.parse(examples[4].example).steps[0].input
        .policySettings,
    };
    const invalidInput = {
      policySettings: {
        minimum_reviewers: {
          test: 'test',
        },
      },
    };

    expect(() =>
      setMinimumReviewersSettingsFields(
        invalidInput.policySettings,
        'minimum_reviewers',
      ),
    ).toThrow();
    expect(
      setMinimumReviewersSettingsFields(
        validInput.policySettings,
        'invalidPolicyType',
      ),
    ).toEqual({});
  });

  it(`test setStatusSettingsFields`, async () => {
    const validInput = {
      policySettings: yaml.parse(examples[0].example).steps[0].input
        .policySettings,
    };
    const invalidInput = {
      policySettings: {
        status: {
          test: 'test',
        },
      },
    };

    expect(() =>
      setStatusSettingsFields(invalidInput.policySettings, 'status'),
    ).toThrow();
    expect(
      setStatusSettingsFields(validInput.policySettings, 'invalidPolicyType'),
    ).toEqual({});
  });
});
