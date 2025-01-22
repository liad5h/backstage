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

const repoUrl = {
  title: 'Repository Location',
  description: `Accepts the format 'dev.azure.com?organization=organization&project=project&repo=repo' where 'repo' is the new repository name`,
  type: 'string',
};

const repositoryId = {
  title: 'Repository ID',
  description: 'The ID of the repository.',
  type: 'string',
};

const policyScopes = {
  type: 'array',
  title: 'Policy Scopes',
  description: 'The scopes to apply the policy to.',
  items: {
    type: 'object',
    properties: {
      refName: {
        title: 'Ref Name',
        description:
          'The name of the ref, for example refs/heads/myBranchName.',
        type: 'string',
      },
      matchKind: {
        title: 'Match Kind',
        description: 'The kind of match.',
        type: 'string',
        enum: ['exact', 'prefix'],
      },
    },
  },
};

const policyType = {
  title: 'Policy Type',
  description: 'The type of policy to create',
  type: 'string',
  enum: [
    'status',
    'minimum_reviewers',
    'required_reviewers',
    'searchable_branches',
  ],
};

const policyIdByType: Map<string, string> = new Map([
  ['status', 'cbdc66da-9728-4af8-aada-9a5a32e4a226'],
  ['minimum_reviewers', 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd'],
  ['required_reviewers', 'fd2167ab-b0be-447a-8ec8-39368250530e'],
  ['searchable_branches', '0517f88d-4ec5-4343-9d26-9930ebd53069'],
]);

const policyIsEnabled = {
  type: 'boolean',
  title: 'Is Enabled',
  description: 'Whether the policy is enabled.',
};

const policyIsBlocking = {
  type: 'boolean',
  title: 'Is Blocking',
  description: 'Whether the policy is blocking PRs from being merged.',
};

const token = {
  title: 'Authentication Token',
  description: 'The token to use for authorization to Azure',
  type: 'string',
};

const policySettings = {
  // TODO: refactor the functions and tests that are dependent on this object
  title: 'Policy Settings',
  description: 'The settings for the policy.',
  type: 'object',
  properties: {
    statusName: {
      title: 'Status name',
      description:
        'The name of the status. required when policyType is status.',
      type: 'string',
    },
    statusGenre: {
      title: 'Status genre',
      description:
        'The genre of the status. required when policyType is status.',
      type: 'string',
    },
    invalidateOnSourceUpdate: {
      title: 'Invalidate On Source Update',
      description:
        'Whether the policy should invalidate the status if the source branch is updated. optional when policyType is status.',
      type: 'boolean',
    },
    minimumApproverCount: {
      title: 'Minimum Approver Count',
      description:
        'The minimum number of reviewers required to approve a pull request. required when policyType is minimum_reviewers or required_reviewers.',
      type: 'number',
    },
    creatorVoteCounts: {
      title: 'Creator Vote Counts',
      description:
        'Whether the creator vote counts as a reviewer vote. optional when policyType is minimum_reviewers or required_reviewers.',
      type: 'boolean',
    },
    requiredReviewerIds: {
      title: 'Required Reviewer Ids',
      description:
        'The IDs of the required reviewers. required when policyType is required_reviewers.',
      type: 'array',
      items: {
        type: 'string',
      },
    },
    filenamePatterns: {
      title: 'Filename Patterns',
      description:
        'The filename patterns to match. optional when policyType is required_reviewers.',
      type: 'array',
      items: {
        type: 'string',
      },
    },
    searchBranches: {
      title: 'Search Branches',
      description:
        'The branches to set as searchable. required when policyType is searchable_branches.',
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

// const policySettings = {
//   status: {
//     title: 'status',
//     description: 'The status name and genre to set for the repository.',
//     type: 'object',
//     properties: {
//       name: {
//         title: 'Status name',
//         description: 'The name of the status.',
//         type: 'string',
//       },
//       genre: {
//         title: 'Status genre',
//         description: 'The genre of the status.',
//         type: 'string',
//       },
//     },
//   },
//   minimum_reviewers: {
//     title: 'minimum_reviewers',
//     description:
//       'The minimum number of reviewers required to approve a pull request.',
//     type: 'object',
//     properties: {
//       minimumApproverCount: {
//         title: 'Minimum Approver Count',
//         description:
//           'The minimum number of reviewers required to approve a pull request.',
//         type: 'number',
//       },
//       creatorVoteCounts: {
//         title: 'Creator Vote Counts',
//         description: 'Whether the creator vote counts as a reviewer vote.',
//         type: 'boolean',
//       },
//     },
//   },
//   required_reviewers: {
//     title: 'required_reviewers',
//     description:
//       'The minimum number of reviewers from specific groups to approve a pull request.',
//     type: 'object',
//     properties: {
//       minimumApproverCount: {
//         title: 'Minimum Approver Count',
//         description:
//           'The minimum number of reviewers required to approve a pull request.',
//         type: 'number',
//       },
//       creatorVoteCounts: {
//         title: 'Creator Vote Counts',
//         description: 'Whether the creator vote counts as a reviewer vote.',
//         type: 'boolean',
//       },
//       requiredReviewerIds: {
//         title: 'Required Reviewer Ids',
//         description: 'The IDs of the required reviewers.',
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//       },
//       filenamePatterns: {
//         title: 'Filename Patterns',
//         description: 'The filename patterns to match.',
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//       },
//     },
//   },
//   searchable_branches: {
//     title: 'searchable_branches',
//     description:
//       'The branches to set as searchable, for example refs/heads/myBranchName.',
//     type: 'object',
//     properties: {
//       searchBranches: {
//         title: 'Search Branches',
//         description: 'The branches to set as searchable.',
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//       },
//     },
//   },
// };

export {
  repoUrl,
  repositoryId,
  policyType,
  policySettings,
  policyScopes,
  policyIdByType,
  policyIsEnabled,
  policyIsBlocking,
  token,
};
