import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { useCurrentEnvironment } from '@CE/react/hooks/useCurrentEnvironment';
import { isAgentEnvironment } from '@CE/react/portainer/environments/utils';

import { useIsSwarm } from './useInfo';

export function useIsSwarmAgent() {
  const envId = useEnvironmentId();
  const isSwarm = useIsSwarm(envId);
  const envQuery = useCurrentEnvironment();

  if (!envQuery.isSuccess) {
    return false;
  }

  return isSwarm && isAgentEnvironment(envQuery.data.Type);
}
