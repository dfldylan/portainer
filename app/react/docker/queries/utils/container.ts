import { ContainerListViewModel } from '@CE/react/docker/containers/types';
import { EdgeStack } from '@CE/react/edge/edge-stacks/types';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerSnapshotUrl, queryKeys as rootQueryKeys } from './root';

export interface ContainersQueryParams {
  edgeStackId?: EdgeStack['Id'];
}

export const queryKeys = {
  ...rootQueryKeys,
  containers: (environmentId: EnvironmentId) =>
    [...queryKeys.snapshot(environmentId), 'containers'] as const,
  containersQuery: (
    environmentId: EnvironmentId,
    params: ContainersQueryParams
  ) => [...queryKeys.containers(environmentId), params] as const,
  container: (
    environmentId: EnvironmentId,
    containerId: ContainerListViewModel['Id']
  ) => [...queryKeys.containers(environmentId), containerId] as const,
};

export function buildDockerSnapshotContainersUrl(
  environmentId: EnvironmentId,
  containerId?: ContainerListViewModel['Id']
) {
  let url = `${buildDockerSnapshotUrl(environmentId)}/containers`;

  if (containerId) {
    url += `/${containerId}`;
  }

  return url;
}
