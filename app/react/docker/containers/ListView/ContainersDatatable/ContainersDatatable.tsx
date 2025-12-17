import { Box } from 'lucide-react';

import { ContainerListViewModel } from '@CE/react/docker/containers/types';
import { useShowGPUsColumn } from '@CE/react/docker/containers/utils';
import { Environment } from '@CE/react/portainer/environments/types';

import { Datatable, Table } from '@@CE/datatables';
import {
  ColumnVisibilityMenu,
  getColumnVisibilityState,
} from '@@CE/datatables/ColumnVisibilityMenu';
import {
  QuickActionsSettings,
  buildAction,
} from '@@CE/datatables/QuickActionsSettings';
import { mergeOptions } from '@@CE/datatables/extend-options/mergeOptions';
import { withColumnFilters } from '@@CE/datatables/extend-options/withColumnFilters';
import { TableSettingsProvider } from '@@CE/datatables/useTableSettings';
import { useTableState } from '@@CE/datatables/useTableState';

import { useContainers } from '../../queries/useContainers';

import { ContainersDatatableActions } from './ContainersDatatableActions';
import { ContainersDatatableSettings } from './ContainersDatatableSettings';
import { RowProvider } from './RowContext';
import { useColumns } from './columns';
import { createStore } from './datatable-store';

const storageKey = 'containers';
const settingsStore = createStore(storageKey);

const actions = [
  buildAction('logs', 'Logs'),
  buildAction('inspect', 'Inspect'),
  buildAction('stats', 'Stats'),
  buildAction('exec', 'Console'),
  buildAction('attach', 'Attach'),
];

export interface Props {
  isHostColumnVisible: boolean;
  environment: Environment;
}

export function ContainersDatatable({
  isHostColumnVisible,
  environment,
}: Props) {
  const isGPUsColumnVisible = useShowGPUsColumn(environment);
  const columns = useColumns(isHostColumnVisible, isGPUsColumnVisible);
  const tableState = useTableState(settingsStore, storageKey);

  const containersQuery = useContainers(environment.Id, {
    autoRefreshRate: tableState.autoRefreshRate * 1000,
  });

  return (
    <RowProvider context={{ environment }}>
      <TableSettingsProvider settings={settingsStore}>
        <Datatable
          titleIcon={Box}
          title="Containers"
          settingsManager={tableState}
          columns={columns}
          renderTableActions={(selectedRows) => (
            <ContainersDatatableActions
              selectedItems={selectedRows}
              isAddActionVisible
              endpointId={environment.Id}
            />
          )}
          isLoading={containersQuery.isLoading}
          isRowSelectable={(row) => !row.original.IsPortainer}
          initialTableState={getColumnVisibilityState(tableState.hiddenColumns)}
          data-cy="docker-containers-datatable"
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
                <ContainersDatatableSettings
                  isRefreshVisible
                  settings={tableState}
                />
              </Table.SettingsMenu>
            </>
          )}
          dataset={containersQuery.data || []}
          extendTableOptions={mergeOptions(
            withColumnFilters(
              tableState.columnFilters,
              tableState.setColumnFilters
            )
          )}
        />
      </TableSettingsProvider>
    </RowProvider>
  );
}
