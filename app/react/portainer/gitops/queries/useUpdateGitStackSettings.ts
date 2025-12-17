import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { GitStackPayload } from '@CE/react/common/stacks/types';
import { buildStackUrl } from '@CE/react/common/stacks/queries/buildUrl';
import { queryKeys } from '@CE/react/common/stacks/queries/query-keys';

async function updateGitStackSettings(
  stackId: number,
  endpointId: number,
  payload: GitStackPayload
) {
  try {
    const { data } = await axios.post(buildStackUrl(stackId, 'git'), payload, {
      params: { endpointId },
    });
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error);
  }
}

export function useUpdateGitStackSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stackId,
      endpointId,
      payload,
    }: {
      stackId: number;
      endpointId: number;
      payload: GitStackPayload;
    }) => updateGitStackSettings(stackId, endpointId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.base() });
    },
  });
}
