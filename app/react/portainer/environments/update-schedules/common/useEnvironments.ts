import { useEnvironmentList } from '@CE/react/portainer/environments/queries/useEnvironmentList';
import { EdgeGroupId, EdgeTypes } from '@CE/react/portainer/environments/types';

export function useEnvironments(edgeGroupIds: Array<EdgeGroupId>) {
  const environmentsQuery = useEnvironmentList(
    { edgeGroupIds, types: EdgeTypes, pageLimit: 0, excludeSnapshots: true },
    {
      enabled: edgeGroupIds.length > 0,
    }
  );

  return environmentsQuery.environments;
}
