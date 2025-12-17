import { EnvironmentId } from '@CE/react/portainer/environments/types';

export const queryKeys = {
  list: (environmentId: EnvironmentId) =>
    ['environments', environmentId, 'kubernetes', 'serviceaccounts'] as const,
};
