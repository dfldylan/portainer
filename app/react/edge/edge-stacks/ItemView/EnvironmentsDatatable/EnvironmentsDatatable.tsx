import { useCurrentStateAndParams } from '@uirouter/react';
import { HardDrive } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EdgeStackStatus, StatusType } from '@CE/react/edge/edge-stacks/types';
import { useEnvironmentList } from '@CE/react/portainer/environments/queries';
import { useParamState } from '@CE/react/hooks/useParamState';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { isBE } from '@CE/react/portainer/feature-flags/feature-flags.service';

import { Datatable } from '@@CE/datatables';
import { PortainerSelect } from '@@CE/form-components/PortainerSelect';
import { createPersistedStore } from '@@CE/datatables/types';
import { useTableState } from '@@CE/datatables/useTableState';

import { useEdgeStack } from '../../queries/useEdgeStack';

import { EdgeStackEnvironment } from './types';
import { columns } from './columns';

const tableKey = 'edge-stacks-environment';

const settingsStore = createPersistedStore(tableKey);

export function EnvironmentsDatatable() {
  const {
    params: { stackId },
  } = useCurrentStateAndParams();
  const edgeStackQuery = useEdgeStack(stackId, {
    refetchInterval(data) {
      if (!data) {
        return 0;
      }

      return Object.values(data.Status).some((status) =>
        status.Status.every((s) => s.Type === StatusType.Running)
      )
        ? 0
        : 10000;
    },
  });

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useParamState<StatusType>(
    'status',
    (value) => (value ? parseInt(value, 10) : undefined)
  );
  const tableState = useTableState(settingsStore, tableKey);
  const environmentsQuery = useEnvironmentList({
    pageLimit: tableState.pageSize,
    page: page + 1,
    search: tableState.search,
    sort: tableState.sortBy?.id as 'Group' | 'Name',
    order: tableState.sortBy?.desc ? 'desc' : 'asc',
    edgeStackId: stackId,
    edgeStackStatus: statusFilter,
  });

  const currentFileVersion =
    edgeStackQuery.data?.StackFileVersion?.toString() || '';
  const gitConfigURL = edgeStackQuery.data?.GitConfig?.URL || '';
  const gitConfigCommitHash = edgeStackQuery.data?.GitConfig?.ConfigHash || '';
  const environments: Array<EdgeStackEnvironment> = useMemo(
    () =>
      environmentsQuery.environments.map(
        (env) =>
          ({
            ...env,
            TargetFileVersion: currentFileVersion,
            GitConfigURL: gitConfigURL,
            TargetCommitHash: gitConfigCommitHash,
            StackStatus: getEnvStackStatus(
              env.Id,
              edgeStackQuery.data?.Status[env.Id]
            ),
          }) satisfies EdgeStackEnvironment
      ),
    [
      currentFileVersion,
      edgeStackQuery.data?.Status,
      environmentsQuery.environments,
      gitConfigCommitHash,
      gitConfigURL,
    ]
  );

  const envStatusSelectOptions = [
    { value: StatusType.Pending, label: 'Pending' },
    { value: StatusType.Acknowledged, label: 'Acknowledged' },
    { value: StatusType.ImagesPulled, label: 'Images pre-pulled' },
    { value: StatusType.Running, label: 'Deployed' },
    { value: StatusType.Error, label: 'Failed' },
  ];
  if (isBE) {
    envStatusSelectOptions.concat([
      { value: StatusType.PausedDeploying, label: 'Paused' },
      { value: StatusType.RollingBack, label: 'Rolling back' },
      { value: StatusType.RolledBack, label: 'Rolled back' },
    ]);
  }

  return (
    <Datatable
      columns={columns}
      isLoading={environmentsQuery.isLoading}
      dataset={environments}
      settingsManager={tableState}
      title="Environments Status"
      titleIcon={HardDrive}
      isServerSidePagination
      page={page}
      onPageChange={setPage}
      totalCount={environmentsQuery.totalCount}
      disableSelect
      description={
        <div className="w-1/4">
          <PortainerSelect<StatusType | undefined>
            isClearable
            bindToBody
            value={statusFilter}
            onChange={(e) => setStatusFilter(e ?? undefined)}
            options={envStatusSelectOptions}
            data-cy="edge-stacks-environments-status-filter"
          />
        </div>
      }
      data-cy="edge-stacks-environments-datatable"
    />
  );
}

function getEnvStackStatus(
  envId: EnvironmentId,
  envStatus: EdgeStackStatus | undefined
) {
  const pendingStatus = {
    Type: StatusType.Pending,
    Error: '',
    Time: new Date().valueOf() / 1000,
  };

  let status = envStatus;
  if (!status) {
    status = {
      EndpointID: envId,
      DeploymentInfo: {
        Version: 0,
        ConfigHash: '',
        FileVersion: 0,
      },
      Status: [],
    };
  }

  if (status.Status.length === 0) {
    status.Status.push(pendingStatus);
  }

  return status;
}
