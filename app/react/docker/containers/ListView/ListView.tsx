import { useInfo } from '@CE/react/docker/proxy/queries/useInfo';
import { Environment } from '@CE/react/portainer/environments/types';
import { isAgentEnvironment } from '@CE/react/portainer/environments/utils';

import { PageHeader } from '@@CE/PageHeader';

import { ContainersDatatable } from './ContainersDatatable';

interface Props {
  endpoint: Environment;
}

export function ListView({ endpoint: environment }: Props) {
  const isAgent = isAgentEnvironment(environment.Type);

  const envInfoQuery = useInfo(environment.Id, {
    select: (info) => !!info.Swarm?.NodeID,
  });

  const isSwarmManager = !!envInfoQuery.data;
  const isHostColumnVisible = isAgent && isSwarmManager;
  return (
    <>
      <PageHeader
        title="Container list"
        breadcrumbs={[{ label: 'Containers' }]}
        reload
      />

      <ContainersDatatable
        isHostColumnVisible={isHostColumnVisible}
        environment={environment}
      />
    </>
  );
}
