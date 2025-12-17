import { useCurrentStateAndParams } from '@uirouter/react';

import LaptopCode from '@CE/assets/ico/laptop-code.svg?c';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { useApplications } from '@CE/react/kubernetes/applications/queries/useApplications';

import { Datatable, TableSettingsMenu } from '@@CE/datatables';
import { TableSettingsMenuAutoRefresh } from '@@CE/datatables/TableSettingsMenuAutoRefresh';
import { useTableStateWithStorage } from '@@CE/datatables/useTableState';
import {
  BasicTableSettings,
  refreshableSettings,
  RefreshableTableSettings,
} from '@@CE/datatables/types';

import { useColumns } from './columns';

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {}

export function NodeApplicationsDatatable() {
  const tableState = useTableStateWithStorage<TableSettings>(
    'kube-node-apps',
    'Name',
    (set) => ({
      ...refreshableSettings(set),
    })
  );

  const envId = useEnvironmentId();
  const {
    params: { nodeName },
  } = useCurrentStateAndParams();
  const applicationsQuery = useApplications(envId, {
    nodeName,
    refetchInterval: tableState.autoRefreshRate * 1000,
  });
  const applications = applicationsQuery.data ?? [];

  const columns = useColumns();

  return (
    <Datatable
      dataset={applications}
      settingsManager={tableState}
      columns={columns}
      disableSelect
      title="Applications running on this node"
      titleIcon={LaptopCode}
      isLoading={applicationsQuery.isLoading}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRate}
            onChange={tableState.setAutoRefreshRate}
          />
        </TableSettingsMenu>
      )}
      data-cy="node-applications-datatable"
    />
  );
}
