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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as helpers from './helpers';
import { WebApi } from 'azure-devops-node-api';
import * as PolicyInterfaces from 'azure-devops-node-api/interfaces/PolicyInterfaces';
import { examples } from './azurePolicyConfiguration.examples';
import * as inputProps from './inputProperties';

const createAzurePolicyConfiguration = async (opts: {
  isEnabled?: boolean;
  isBlocking?: boolean;
  policyType: string;
  policyScopes: Array<{ [key: string]: string }>;
  policySettings: { [key: string]: any };
  project: string;
  repositoryId: string;
  azureWebApi: WebApi;
}) => {
  const {
    isEnabled = true,
    isBlocking = true,
    policyType,
    policyScopes = [],
    policySettings,
    project,
    repositoryId,
    azureWebApi,
  } = opts;

  const settings: { [key: string]: any } = {
    ...helpers.setStatusSettingsFields(policySettings, policyType),
    ...helpers.setMinimumReviewersSettingsFields(policySettings, policyType),
    ...helpers.setRequiredReviewersSettingsFields(policySettings, policyType),
    ...helpers.setSearchableBranchesSettingsFields(policySettings, policyType),
  };

  const policyConfiguration: PolicyInterfaces.PolicyConfiguration = {
    isEnabled: isEnabled,
    isBlocking: isBlocking,
    type: {
      id: inputProps.policyIdByType.get(policyType) as string,
    },
    settings: {
      ...settings,
      ...{
        scope: helpers.setPolicyScopes(policyScopes, policyType, repositoryId),
      },
    },
  };

  const client = await azureWebApi.getPolicyApi();
  const returnedPolicyConfiguration = await client.createPolicyConfiguration(
    policyConfiguration,
    project,
  );
  if (!returnedPolicyConfiguration) {
    throw new InputError(
      `Unable to create the policy configuration for project ${project} with body ${policyConfiguration}`,
    );
  }
  return returnedPolicyConfiguration;
};

/**
 * Creates a new action that adds a policy configuration to an Azure DevOps repository.
 * @public
 */
export function createAzurePolicyConfigurationAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    repositoryId: string;
    policyType: string;
    policyScopes?: Array<{ [key: string]: string }>;
    policySettings: { [key: string]: any };
    isEnabled?: boolean;
    isBlocking?: boolean;
    token?: string;
  }>({
    id: 'azure:policyConfiguration:create',
    examples,
    supportsDryRun: true,
    description: 'Creates Azure DevOps policy configurations.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'repositoryId', 'policyType', 'policySettings'],
        properties: {
          repoUrl: inputProps.repoUrl,
          repositoryId: inputProps.repositoryId,
          policyType: inputProps.policyType,
          policySettings: inputProps.policySettings,
          policyScopes: inputProps.policyScopes,
          isEnabled: inputProps.policyIsEnabled,
          isBlocking: inputProps.policyIsBlocking,
          token: inputProps.token,
        },
      },
      output: {
        type: 'object',
        properties: {
          json: {
            title: 'The response from Azure DevOps cloud',
            type: 'string',
          },
          statusCode: {
            title: 'The status code of the response',
            type: 'number',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        repositoryId,
        policyType,
        policySettings,
        policyScopes = [],
        isEnabled = true,
        isBlocking = true,
      } = ctx.input;

      const { project, host, organization } = helpers.parseUrl(
        repoUrl,
        integrations,
      );

      // If this is a dry run, log and return
      if (ctx.isDryRun) {
        ctx.logger.info(
          `Dry run complete, inputs: ${JSON.stringify(ctx.input)}`,
        );
        return;
      }

      const webApi = await helpers.getAzureWebApi(
        host,
        organization,
        integrations,
        ctx.input.token,
      );
      await createAzurePolicyConfiguration({
        isEnabled: isEnabled,
        isBlocking: isBlocking,
        policyType: policyType,
        policyScopes: policyScopes,
        policySettings: policySettings,
        project: project as string,
        repositoryId: repositoryId,
        azureWebApi: webApi,
      });
    },
  });
}
