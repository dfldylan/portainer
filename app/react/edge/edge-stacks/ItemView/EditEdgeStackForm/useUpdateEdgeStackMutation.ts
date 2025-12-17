import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { buildUrl } from '@CE/react/edge/edge-stacks/queries/buildUrl';
import {
  DeploymentType,
  EdgeStack,
  StaggerConfig,
} from '@CE/react/edge/edge-stacks/types';
import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import { Registry } from '@CE/react/portainer/registries/types/registry';
import { Pair } from '@CE/react/portainer/settings/types';

import { queryKeys } from '../../queries/query-keys';

export interface UpdateEdgeStackPayload {
  id: EdgeStack['Id'];
  stackFileContent: string;
  edgeGroups: Array<EdgeGroup['Id']>;
  deploymentType: DeploymentType;
  registries: Array<Registry['Id']>;
  useManifestNamespaces: boolean;
  prePullImage?: boolean;
  rePullImage?: boolean;
  retryDeploy?: boolean;
  updateVersion: boolean;
  webhook?: string;
  envVars: Pair[];
  rollbackTo?: number;
  staggerConfig?: StaggerConfig;
}

export function useUpdateEdgeStackMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateEdgeStack,
    mutationOptions(
      withError('Failed updating stack'),
      withInvalidate(queryClient, [queryKeys.base()])
    )
  );
}

async function updateEdgeStack({ id, ...payload }: UpdateEdgeStackPayload) {
  try {
    await axios.put(buildUrl(id), payload);
  } catch (err) {
    throw parseAxiosError(err as Error, 'Failed updating stack');
  }
}
