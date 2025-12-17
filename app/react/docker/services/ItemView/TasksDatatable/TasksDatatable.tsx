import { List } from 'lucide-react';

import { Datatable } from '@@CE/datatables';
import { mergeOptions } from '@@CE/datatables/extend-options/mergeOptions';
import { withColumnFilters } from '@@CE/datatables/extend-options/withColumnFilters';
import { withMeta } from '@@CE/datatables/extend-options/withMeta';
import {
  BasicTableSettings,
  filteredColumnsSettings,
  type FilteredColumnsTableSettings,
} from '@@CE/datatables/types';
import { useTableStateWithStorage } from '@@CE/datatables/useTableState';

import { useColumns } from './columns';
import { DecoratedTask } from './types';

const storageKey = 'docker-service-tasks';

interface TableSettings
  extends BasicTableSettings,
    FilteredColumnsTableSettings {}

export function TasksDatatable({
  dataset,
  isSlotColumnVisible,
  serviceName,
}: {
  dataset: DecoratedTask[];
  isSlotColumnVisible: boolean;
  serviceName: string;
}) {
  const tableState = useTableStateWithStorage<TableSettings>(
    storageKey,
    undefined,
    (set) => ({
      ...filteredColumnsSettings(set),
    })
  );
  const columns = useColumns(isSlotColumnVisible);

  return (
    <Datatable
      title="Tasks"
      titleIcon={List}
      settingsManager={tableState}
      columns={columns}
      dataset={dataset}
      extendTableOptions={mergeOptions(
        withMeta({ table: 'tasks', serviceName }),
        withColumnFilters(tableState.columnFilters, tableState.setColumnFilters)
      )}
      disableSelect
      data-cy="docker-service-tasks-datatable"
    />
  );
}
