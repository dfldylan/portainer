import { userQueryKeys } from '@CE/portainer/users/queries/queryKeys';
import { UserId } from '@CE/portainer/users/types';

export const queryKeys = {
  base: (userId: UserId) => [...userQueryKeys.user(userId), 'tokens'] as const,
};
