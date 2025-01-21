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

import {
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import {
  getBearerHandler,
  getPersonalAccessTokenHandler,
  WebApi,
} from 'azure-devops-node-api';

export const parseUrl = (
  repoUrl: string,
  integrations: ScmIntegrationRegistry,
) => {
  const { project, host, organization } = parseRepoUrl(repoUrl, integrations);

  if (!organization) {
    throw new InputError(
      `Invalid URL provider was included in the repo URL to create ${repoUrl}, missing organization`,
    );
  }

  if (!host) {
    throw new InputError(
      `Invalid URL provider was included in the repo URL to create ${repoUrl}, missing host`,
    );
  }

  if (!project) {
    throw new InputError(
      `Invalid URL provider was included in the repo URL to create ${repoUrl}, missing project`,
    );
  }
  return { project, host, organization };
};

export const getAzureWebApi = async (
  host: string,
  organization: string,
  integrations: ScmIntegrationRegistry,
  token: string | undefined = undefined,
) => {
  const url = `https://${host}/${organization}`;
  const credentialProvider =
    DefaultAzureDevOpsCredentialsProvider.fromIntegrations(integrations);
  const credentials = await credentialProvider.getCredentials({ url: url });

  if (credentials === undefined && token === undefined) {
    throw new InputError(
      `No credentials provided ${url}, please check your integrations config`,
    );
  }

  const authHandler =
    token || credentials?.type === 'pat'
      ? getPersonalAccessTokenHandler(token ?? credentials!.token)
      : getBearerHandler(credentials!.token);

  return new WebApi(url, authHandler);
};

/* @internal */
export function setStatusSettingsFields(
  policySettings: {
    [key: string]: { [key: string]: any };
  },
  policyType: string,
): { [key: string]: string } | {} {
  const key: string = 'status';
  if (policyType === key) {
    if (
      policySettings[key]?.name === undefined ||
      policySettings[key]?.genre === undefined
    ) {
      throw new Error(`name and genre must be set for ${key}`);
    }
    return {
      statusName: policySettings[key].name,
      statusGenre: policySettings[key].genre,
    };
  }
  return {};
}

/* @internal */
export function setMinimumReviewersSettingsFields(
  policySettings: {
    [key: string]: { [key: string]: any };
  },
  policyType: string,
): { [key: string]: string } | {} {
  const key: string = 'minimum_reviewers';
  if (policyType === key) {
    if (policySettings[key]?.minimumApproverCount === undefined) {
      throw new Error(`minimumApproverCount must be set for ${key}`);
    }
    return {
      minimumApproverCount: policySettings[key]?.minimumApproverCount,
      creatorVoteCounts: policySettings[key]?.creatorVoteCounts || false,
    };
  }
  return {};
}

/* @internal */
export function setRequiredReviewersSettingsFields(
  policySettings: {
    [key: string]: { [key: string]: any };
  },
  policyType: string,
): { [key: string]: string } | {} {
  const key: string = 'required_reviewers';
  if (policyType === key) {
    if (
      policySettings[key]?.minimumApproverCount === undefined ||
      policySettings[key]?.requiredReviewerIds === undefined
    ) {
      throw new Error(
        `minimumApproverCount and requiredReviewerIds must be set for ${key}`,
      );
    }
    return {
      minimumApproverCount: policySettings[key]?.minimumApproverCount,
      creatorVoteCounts: policySettings[key]?.creatorVoteCounts || false,
      requiredReviewerIds: policySettings[key]?.requiredReviewerIds,
      filenamePatterns: policySettings[key]?.filenamePatterns || [],
    };
  }
  return {};
}

/* @internal */
export function setSearchableBranchesSettingsFields(
  policySettings: {
    [key: string]: { [key: string]: any };
  },
  policyType: string,
): { [key: string]: string } | {} {
  const key: string = 'searchable_branches';
  if (policyType === key) {
    if (policySettings[key]?.searchBranches === undefined) {
      throw new Error(`searchBranches must be set for ${key}`);
    }
    return { ...policySettings[key] };
  }
  return {};
}

export function setPolicyScopes(
  policyScopes: Array<{
    [key: string]: string;
  }>,
  policyType: string,
  repositoryId: string,
): Array<{ [key: string]: string }> {
  const scopes: Array<{ [key: string]: string }> = [];
  if (
    ['status', 'minimum_reviewers', 'required_reviewers'].includes(policyType)
  ) {
    policyScopes.forEach(scope => {
      if (!scope.hasOwnProperty('refName')) {
        throw new Error(
          `refName must be set in each scope when policy type is ${policyType}`,
        );
      }
      scopes.push({
        refName: scope.refName,
        repositoryId: repositoryId,
        matchKind: scope.matchKind || 'exact',
      });
    });
  } else if (policyType === 'searchable_branches') {
    scopes.push({
      repositoryId: repositoryId,
    });
  } else {
    throw new Error(`unknown policy type ${policyType}`);
  }
  return scopes;
}
