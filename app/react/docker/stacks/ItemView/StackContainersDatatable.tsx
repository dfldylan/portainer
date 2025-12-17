import { Box } from 'lucide-react';

import { ContainerListViewModel } from '@CE/react/docker/containers/types';
import { createStore } from '@CE/react/docker/containers/ListView/ContainersDatatable/datatable-store';
import { useColumns } from '@CE/react/docker/containers/ListView/ContainersDatatable/columns';
import { ContainersDatatableActions } from '@CE/react/docker/containers/ListView/ContainersDatatable/ContainersDatatableActions';
import { ContainersDatatableSettings } from '@CE/react/docker/containers/ListView/ContainersDatatable/ContainersDatatableSettings';
import { useShowGPUsColumn } from '@CE/react/docker/containers/utils';
import { useCurrentEnvironment } from '@CE/react/hooks/useCurrentEnvironment';

import { Datatable, Table } from '@@CE/datatables';
import {
  buildAction,
  QuickActionsSettings,
} from '@@CE/datatables/QuickActionsSettings';
import {
  ColumnVisibilityMenu,
  getColumnVisibilityState,
} from '@@CE/datatables/ColumnVisibilityMenu';
import { TableSettingsProvider } from '@@CE/datatables/useTableSettings';
import { useTableState } from '@@CE/datatables/useTableState';

import { RowProvider } from '../../containers/ListView/ContainersDatatable/RowContext';

import { useComposeStackContainers } from './useComposeStackContainers';

const storageKey = 'stack-containers';
const settingsStore = createStore(storageKey);

const actions = [
  buildAction('logs', 'Logs'),
  buildAction('inspect', 'Inspect'),
  buildAction('stats', 'Stats'),
  buildAction('exec', 'Console'),
  buildAction('attach', 'Attach'),
];

export interface Props {
  stackName: string;
}

export function StackContainersDatatable({ stackName }: Props) {
  const environmentQuery = useCurrentEnvironment();
  const tableState = useTableState(settingsStore, storageKey);

  const isGPUsColumnVisible = useShowGPUsColumn(environmentQuery.data);
  const columns = useColumns(false, isGPUsColumnVisible);

  const containersQuery = useComposeStackContainers(
    { environmentId: environmentQuery.data?.Id, stackName },
    {
      autoRefreshRate: tableState.autoRefreshRate * 1000,
    }
  );

  if (!environmentQuery.data) {
    return null;
  }

  const environment = environmentQuery.data;

  return (
    <RowProvider context={{ environment }}>
      <TableSettingsProvider settings={settingsStore}>
        <Datatable
          title="Containers"
          titleIcon={Box}
          settingsManager={tableState}
          columns={columns}
          renderTableActions={(selectedRows) => (
            <ContainersDatatableActions
              selectedItems={selectedRows}
              isAddActionVisible={false}
              endpointId={environment.Id}
            />
          )}
          initialTableState={getColumnVisibilityState(tableState.hiddenColumns)}
          data-cy="stack-containers-datatable"
          renderTableSettings={(tableInstance) => (
            <>
              <ColumnVisibilityMenu<ContainerListViewModel>
                table={tableInstance}
                onChange={(hiddenColumns) => {
                  tableState.setHiddenColumns(hiddenColumns);
                }}
                value={tableState.hiddenColumns}
              />
              <Table.SettingsMenu
                quickActions={<QuickActionsSettings actions={actions} />}
              >
                <ContainersDatatableSettings settings={tableState} />
              </Table.SettingsMenu>
            </>
          )}
          dataset={containersQuery.data || []}
          isLoading={!containersQuery.data}
        />
      </TableSettingsProvider>
    </RowProvider>
  );
}
