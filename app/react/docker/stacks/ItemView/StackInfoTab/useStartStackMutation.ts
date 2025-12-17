import { useMutation } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { buildStackUrl } from '@CE/react/common/stacks/queries/buildUrl';
import { Stack } from '@CE/react/common/stacks/types';

export function useStartStackMutation() {
  return useMutation({
    mutationFn: startStack,
  });
}

async function startStack({
  id,
  environmentId,
}: {
  id: Stack['Id'];
  environmentId?: number;
}) {
  try {
    const { data } = await axios.post<Stack>(
      buildStackUrl(id, 'start'),
      undefined,
      { params: { endpointId: environmentId } }
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to start stack');
  }
}
