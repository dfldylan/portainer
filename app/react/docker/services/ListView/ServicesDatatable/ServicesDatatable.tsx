import { Shuffle } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { useRef } from 'react';

import { ServiceViewModel } from '@CE/docker/models/service';
import { useApiVersion } from '@CE/react/docker/proxy/queries/useVersion';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';

import { IconProps } from '@@CE/Icon';
import { ExpandableDatatable } from '@@CE/datatables/ExpandableDatatable';
import {
  createPersistedStore,
  refreshableSettings,
  hiddenColumnsSettings,
} from '@@CE/datatables/types';
import { useTableState } from '@@CE/datatables/useTableState';
import { useRepeater } from '@@CE/datatables/useRepeater';
import { defaultGlobalFilterFn } from '@@CE/datatables/Datatable';
import { getColumnVisibilityState } from '@@CE/datatables/ColumnVisibilityMenu';
import { mergeOptions } from '@@CE/datatables/extend-options/mergeOptions';
import { withGlobalFilter } from '@@CE/datatables/extend-options/withGlobalFilter';

import { DecoratedTask } from '../../ItemView/TasksDatatable/types';

import { useColumns } from './columns';
import { TasksDatatable } from './TasksDatatable';
import { TableActions } from './TableActions';
import { type TableSettings as TableSettingsType } from './types';
import { TableSettings } from './TableSettings';

export function ServicesDatatable({
  titleIcon = Shuffle,
  dataset,
  isAddActionVisible,
  isStackColumnVisible,
  onRefresh,
  tableKey,
}: {
  dataset: Array<ServiceViewModel> | undefined;
  titleIcon?: IconProps['icon'];
  isAddActionVisible?: boolean;
  isStackColumnVisible?: boolean;
  onRefresh?(): void;
  tableKey: string;
}) {
  // use a unique tableKey so that unrelated services datatables don't share state
  const store = createPersistedStore<TableSettingsType>(
    tableKey,
    'name',
    (set) => ({
      ...refreshableSettings(set),
      ...hiddenColumnsSettings(set),
      expanded: {},
      setExpanded(value) {
        set({ expanded: value });
      },
    })
  );

  // useRef so that updating the parent filter doesn't cause a re-render
  const parentFilteredStatusRef = useRef<Map<string, boolean>>(new Map());
  const environmentId = useEnvironmentId();
  const apiVersion = useApiVersion(environmentId);
  const tableState = useTableState(store, tableKey);
  const columns = useColumns(isStackColumnVisible);
  useRepeater(tableState.autoRefreshRate, onRefresh);

  return (
    <ExpandableDatatable
      title="Services"
      titleIcon={titleIcon}
      dataset={dataset || []}
      isLoading={!dataset}
      settingsManager={tableState}
      columns={columns}
      getRowCanExpand={({ original: item }) => item.Tasks.length > 0}
      renderSubRow={({ original: item }) => (
        <tr>
          <td />
          <td colSpan={Number.MAX_SAFE_INTEGER}>
            <TasksDatatable
              dataset={item.Tasks as Array<DecoratedTask>}
              search={
                parentFilteredStatusRef.current.get(item.Id)
                  ? ''
                  : tableState.search
              }
            />
          </td>
        </tr>
      )}
      initialTableState={getColumnVisibilityState(tableState.hiddenColumns)}
      renderTableActions={(selectedRows) => (
        <TableActions
          selectedItems={selectedRows}
          isAddActionVisible={isAddActionVisible}
          isUpdateActionVisible={apiVersion >= 1.25}
        />
      )}
      renderTableSettings={(table) => (
        <TableSettings settings={tableState} table={table} />
      )}
      extendTableOptions={mergeOptions(
        (options) => ({
          ...options,
          onExpandedChange: (updater) => {
            const value =
              typeof updater === 'function'
                ? updater(tableState.expanded)
                : updater;
            tableState.setExpanded(value);
          },
          state: {
            expanded: tableState.expanded,
          },
        }),
        withGlobalFilter(filter)
      )}
      data-cy="services-datatable"
    />
  );

  function filter(
    row: Row<ServiceViewModel>,
    columnId: string,
    filterValue: null | { search: string }
  ) {
    parentFilteredStatusRef.current = parentFilteredStatusRef.current.set(
      row.id,
      defaultGlobalFilterFn(row, columnId, filterValue)
    );
    return (
      parentFilteredStatusRef.current.get(row.id) ||
      row.original.Tasks.some((task) =>
        Object.values(task).some(
          (value) =>
            value && value.toString().includes(filterValue?.search || '')
        )
      )
    );
  }
}
