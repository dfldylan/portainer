import {
  ContainerEngine,
  EnvironmentId,
} from '@/react/portainer/environments/types';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';

import { useCanDuplicateEditContainer } from './useCanDuplicateEditContainer';

/**
 * Hook to determine if the recreate button should be displayed
 * Recreate button is hidden for:
 * - Containers in Swarm
 * - Containers with AutoRemove enabled
 * - Podman containers (known issue with memory swappiness in cgroupv2)
 * - Regular users when security settings restrict container operations
 *
 * should be false for Podman because
 * recreating Podman containers gives an error: cannot set memory swappiness with cgroupv2
 * https://github.com/containrrr/watchtower/issues/1060#issuecomment-2319076222
 */
export function useCanRecreateContainer({
  autoRemove,
  environmentId,
}: {
  environmentId: EnvironmentId;
  autoRemove: boolean;
}) {
  const canDuplicate = useCanDuplicateEditContainer({
    autoRemove,
    environmentId,
  });
  const environmentQuery = useCurrentEnvironment();

  if (!environmentQuery.data) {
    return false;
  }

  const isPodman =
    environmentQuery.data.ContainerEngine === ContainerEngine.Podman;

  return canDuplicate && !isPodman;
}
