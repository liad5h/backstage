/*
 * Copyright 2023 The Backstage Authors
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

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description:
      'Create status policy configuration for the main branch of a repository',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'status',
            policyScopes: [
              {
                refName: 'refs/heads/main',
              },
            ],
            policySettings: {
              status: {
                name: 'Status Name',
                genre: 'Status Genre',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Create status policy configuration for the main branch, in a disabled state',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'status',
            policyScopes: [
              {
                refName: 'refs/heads/main',
              },
            ],
            policySettings: {
              status: {
                name: 'Status Name',
                genre: 'Status Genre',
              },
            },
            isEnabled: false,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create status policy configuration for the main branch, in a non blocking state',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'status',
            policyScopes: [
              {
                refName: 'refs/heads/main',
              },
            ],
            policySettings: {
              status: {
                name: 'Status Name',
                genre: 'Status Genre',
              },
            },
            isBlocking: false,
          },
        },
      ],
    }),
  },
  {
    description:
      'Apply the same status policy configuration to multiple branches in the same repository',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'status',
            policyScopes: [
              {
                refName: 'refs/heads/main',
              },
              {
                refName: 'refs/heads/develop',
              },
              {
                refName: 'refs/heads/feature/',
                matchKind: 'prefix',
              },
            ],
            policySettings: {
              status: {
                name: 'Status Name',
                genre: 'Status Genre',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Create minimum reviewers policy configuration for the main branch, where the PR owner can not approve the PR',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'minimum_reviewers',
            policyScopes: [
              {
                refName: 'refs/heads/main',
              },
            ],
            policySettings: {
              minimum_reviewers: {
                minimumApproverCount: 2,
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Create required reviewers policy configuration for all branches prefixed with releases/, where the PR owner can approve the PR',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'required_reviewers',
            policyScopes: [
              {
                refName: 'refs/heads/releases/',
                matchKind: 'prefix',
              },
            ],
            policySettings: {
              required_reviewers: {
                minimumApproverCount: 1,
                creatorVoteCounts: true,
                requiredReviewerIds: ['azure-devops-group-id'],
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Create searchable branches policy configuration for the myTestBranch and anotherBranch branches',
    example: yaml.stringify({
      steps: [
        {
          id: 'policyConfiguration',
          action: 'azure:policyConfiguration:create',
          name: 'Create an Azure DevOps policy configuration',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            policyType: 'searchable_branches',
            policySettings: {
              searchable_branches: {
                searchBranches: [
                  'refs/heads/myTestBranch',
                  'refs/heads/anotherBranch',
                ],
              },
            },
          },
        },
      ],
    }),
  },
];
