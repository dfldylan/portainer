import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { withGlobalError, withInvalidate } from '@CE/react-tools/react-query';
import { UserId } from '@CE/portainer/users/types';
import { buildUrl } from '@CE/portainer/users/user.service';
import { userQueryKeys } from '@CE/portainer/users/queries/queryKeys';

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: UserId) => deleteUser(id),
    ...withGlobalError('Unable to delete user'),
    ...withInvalidate(queryClient, [userQueryKeys.base()]),
  });
}

export async function deleteUser(id: UserId) {
  try {
    await axios.delete(buildUrl(id));
  } catch (error) {
    throw parseAxiosError(error);
  }
}
