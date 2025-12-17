import { LayoutGrid } from 'lucide-react';

import { Datatable } from '@@CE/datatables';
import { useTableState } from '@@CE/datatables/useTableState';
import { createPersistedStore } from '@@CE/datatables/types';

import { useEdgeGroups } from '../queries/useEdgeGroups';

import { columns } from './columns';
import { TableActions } from './TableActions';

const tableKey = 'edge-groups';

const settingsStore = createPersistedStore(tableKey);

export function EdgeGroupsDatatable() {
  const tableState = useTableState(settingsStore, tableKey);
  const edgeGroupsQuery = useEdgeGroups();

  return (
    <Datatable
      title="Edge Groups"
      titleIcon={LayoutGrid}
      columns={columns}
      dataset={edgeGroupsQuery.data || []}
      settingsManager={tableState}
      isLoading={edgeGroupsQuery.isLoading}
      renderTableActions={(selectedItems) => (
        <TableActions selectedItems={selectedItems} />
      )}
      isRowSelectable={({ original: item }) =>
        !(item.HasEdgeStack || item.HasEdgeJob || item.HasEdgeConfig)
      }
      data-cy="edge-groups-datatable"
    />
  );
}
