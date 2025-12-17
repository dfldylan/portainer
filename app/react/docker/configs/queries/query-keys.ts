import { queryKeys as proxyQueryKeys } from '@CE/react/docker/proxy/queries/query-keys';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

export const queryKeys = {
  base: (environmentId: EnvironmentId) =>
    [...proxyQueryKeys.base(environmentId), 'configs'] as const,
  list: (environmentId: EnvironmentId) => queryKeys.base(environmentId),
};
