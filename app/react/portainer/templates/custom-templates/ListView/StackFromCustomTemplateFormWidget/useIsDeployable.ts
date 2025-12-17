import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { StackType } from '@CE/react/common/stacks/types';
import { useIsSwarm } from '@CE/react/docker/proxy/queries/useInfo';

export function useIsDeployable(type: StackType | undefined) {
  const environmentId = useEnvironmentId();

  const isSwarm = useIsSwarm(environmentId);

  switch (type) {
    case StackType.DockerCompose:
      return !isSwarm;
    case StackType.DockerSwarm:
      return isSwarm;
    case StackType.Kubernetes:
    default:
      return false;
  }
}
