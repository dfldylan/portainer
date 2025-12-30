import { useIsEdgeAdmin } from '@/react/hooks/useUser';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useIsSwarm } from '@/react/docker/proxy/queries/useInfo';

import { isRegularUserRestricted } from './utils';

/**
 * Hook to determine if the duplicate/edit button should be displayed
 */
export function useCanDuplicateEditContainer({
  autoRemove,
  environmentId,
}: {
  environmentId: EnvironmentId;
  autoRemove: boolean;
}) {
  const environmentQuery = useCurrentEnvironment();
  const { isAdmin } = useIsEdgeAdmin();
  const inSwarm = useIsSwarm(environmentId);

  if (!environmentQuery.data) {
    return false;
  }

  const regularUserRestricted = isRegularUserRestricted(
    environmentQuery.data.SecuritySettings
  );

  return !inSwarm && !autoRemove && (isAdmin || !regularUserRestricted);
}
