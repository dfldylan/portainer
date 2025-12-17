import { useMutation } from '@tanstack/react-query';

import axios from '@CE/portainer/services/axios';
import { buildStackUrl } from '@CE/react/common/stacks/queries/buildUrl';
import { Stack } from '@CE/react/common/stacks/types';
import { Registry } from '@CE/react/portainer/registries/types/registry';

import { EnvVarValues } from '@@CE/form-components/EnvironmentVariablesFieldset';

export function useUpdateStackMutation() {
  return useMutation({
    mutationFn: updateStack,
  });
}

type Payload = {
  stackFileContent: string;
  env?: EnvVarValues;
  prune?: boolean;
  webhook?: string;
  repullImageAndRedeploy?: boolean;
  rollbackTo?: number;
  registries?: Array<Registry['Id']>;
};

type UpdateStackParams = {
  stackId: number;
  environmentId: number;
  payload: Payload;
};

export async function updateStack({
  stackId,
  environmentId,
  payload,
}: UpdateStackParams): Promise<Stack> {
  return axios.put(buildStackUrl(stackId), payload, {
    params: { endpointId: environmentId },
  });
}
