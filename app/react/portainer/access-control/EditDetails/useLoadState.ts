import { useTeams } from '@CE/react/portainer/users/teams/queries';
import { useUsers } from '@CE/portainer/users/queries';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { useIsEdgeAdmin } from '@CE/react/hooks/useUser';

export function useLoadState(environmentId: EnvironmentId) {
  const isAdminQuery = useIsEdgeAdmin();
  const teams = useTeams(false, environmentId);

  const users = useUsers(false, environmentId, isAdminQuery.isAdmin);

  return {
    teams: teams.data,
    users: users.data,
    isAdmin: isAdminQuery.isAdmin,
    isLoading:
      teams.isInitialLoading ||
      users.isInitialLoading ||
      isAdminQuery.isLoading,
  };
}
