import { useMutation } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { User } from '@CE/portainer/users/types';
import {
  mutationOptions,
  withInvalidate,
  queryClient,
} from '@CE/react-tools/react-query';
import { userQueryKeys } from '@CE/portainer/users/queries/queryKeys';
import { useCurrentUser } from '@CE/react/hooks/useUser';

export function useUpdateUserMutation() {
  const {
    user: { Id: userId },
  } = useCurrentUser();

  return useMutation(
    (user: Partial<User>) => updateUser(user, userId),
    mutationOptions(withInvalidate(queryClient, [userQueryKeys.base()]))
    // error notification should be handled by the caller
  );
}

async function updateUser(user: Partial<User>, userId: number) {
  try {
    const { data } = await axios.put(`/users/${userId}`, user);
    return data;
  } catch (error) {
    throw parseAxiosError(error);
  }
}
