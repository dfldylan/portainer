import { HardDrive } from 'lucide-react';

import { NodeViewModel } from '@CE/docker/models/node';

import { Datatable } from '@@CE/datatables';
import { createPersistedStore } from '@@CE/datatables/types';
import { useTableState } from '@@CE/datatables/useTableState';
import { mergeOptions } from '@@CE/datatables/extend-options/mergeOptions';
import { withMeta } from '@@CE/datatables/extend-options/withMeta';
import { withControlledSelected } from '@@CE/datatables/extend-options/withControlledSelected';

import { useColumns } from './useColumns';

const tableKey = 'macvlan-nodes-selector';
const store = createPersistedStore(tableKey);

export function MacvlanNodesSelector({
  dataset,
  isIpColumnVisible,
  haveAccessToNode,
  value,
  onChange,
}: {
  dataset?: Array<NodeViewModel>;
  isIpColumnVisible: boolean;
  haveAccessToNode: boolean;
  value: Array<NodeViewModel>;
  onChange(value: Array<NodeViewModel>): void;
}) {
  const columns = useColumns(isIpColumnVisible);
  const tableState = useTableState(store, tableKey);

  return (
    <Datatable<NodeViewModel>
      title="Select the nodes where you want to deploy the local configuration"
      titleIcon={HardDrive}
      columns={columns}
      dataset={dataset || []}
      isLoading={!dataset}
      settingsManager={tableState}
      data-cy="macvlan-nodes-selector-datatable"
      extendTableOptions={mergeOptions(
        withMeta({
          table: 'nodes',
          haveAccessToNode,
        }),
        withControlledSelected(
          (ids) =>
            onChange(dataset?.filter((n) => n.Id && ids.includes(n.Id)) || []),
          value.map((n) => n.Id || '')
        )
      )}
    />
  );
}
