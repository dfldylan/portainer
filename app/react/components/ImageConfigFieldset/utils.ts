import {
  Registry,
  RegistryTypes,
} from '@CE/react/portainer/registries/types/registry';

export function getIsDockerHubRegistry(registry?: Registry | null) {
  return (
    !registry ||
    registry.Type === RegistryTypes.DOCKERHUB ||
    registry.Type === RegistryTypes.ANONYMOUS
  );
}
