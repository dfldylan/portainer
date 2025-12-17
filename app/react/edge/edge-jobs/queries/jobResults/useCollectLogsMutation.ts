import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { withInvalidate } from '@CE/react-tools/react-query';

import { EdgeJob } from '../../types';

import { buildUrl } from './build-url';
import { queryKeys } from './query-keys';

export function useCollectLogsMutation(id: EdgeJob['Id']) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (environmentId: EnvironmentId) =>
      collectLogsMutation(id, environmentId),
    ...withInvalidate(queryClient, [queryKeys.base(id)]),
  });
}

async function collectLogsMutation(
  id: EdgeJob['Id'],
  environmentId: EnvironmentId
) {
  try {
    await axios.post(buildUrl({ id, action: 'logs', taskId: environmentId }));
  } catch (err) {
    throw parseAxiosError(err, 'Unable to collect logs');
  }
}
