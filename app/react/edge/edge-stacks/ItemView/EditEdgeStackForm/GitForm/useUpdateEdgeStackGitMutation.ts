import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import {
  AutoUpdateResponse,
  GitAuthenticationResponse,
} from '@CE/react/portainer/gitops/types';
import { buildUrl } from '@CE/react/edge/edge-stacks/queries/buildUrl';
import { DeploymentType, EdgeStack } from '@CE/react/edge/edge-stacks/types';
import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import { Registry } from '@CE/react/portainer/registries/types/registry';

import { queryKeys } from '../../../queries/query-keys';

export interface UpdateEdgeStackGitPayload {
  id: EdgeStack['Id'];
  autoUpdate: AutoUpdateResponse | null;
  refName: string;
  authentication: GitAuthenticationResponse | null;
  groupIds: EdgeGroup['Id'][];
  deploymentType: DeploymentType;
  updateVersion: boolean;
  registries?: Array<Registry['Id']>;
}

export function useUpdateEdgeStackGitMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateEdgeStackGit,
    mutationOptions(
      withError('Failed updating stack'),
      withInvalidate(queryClient, [queryKeys.base()])
    )
  );
}

async function updateEdgeStackGit({
  id,
  ...payload
}: UpdateEdgeStackGitPayload) {
  try {
    await axios.put(buildUrl(id, 'git'), payload);
  } catch (err) {
    throw parseAxiosError(err as Error, 'Failed updating stack');
  }
}
