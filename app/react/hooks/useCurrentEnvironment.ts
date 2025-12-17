import { useEnvironment } from '@CE/react/portainer/environments/queries';

import { useEnvironmentId } from './useEnvironmentId';

export function useCurrentEnvironment(force = true) {
  const id = useEnvironmentId(force);
  return useEnvironment(id, undefined, { excludeSnapshot: false });
}
