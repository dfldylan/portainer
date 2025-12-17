import { Key } from 'lucide-react';

import { Datatable } from '@@CE/datatables';
import { createPersistedStore } from '@@CE/datatables/types';
import { useTableState } from '@@CE/datatables/useTableState';

import { useAccessTokens } from '../../access-tokens/queries/useAccessTokens';

import { columns } from './columns';
import { TableActions } from './TableActions';

const tableKey = 'access-tokens';
const store = createPersistedStore(tableKey);

export function AccessTokensDatatable() {
  const query = useAccessTokens();
  const tableState = useTableState(store, tableKey);

  return (
    <Datatable
      columns={columns}
      isLoading={query.isLoading}
      dataset={query.data || []}
      settingsManager={tableState}
      title="Access tokens"
      titleIcon={Key}
      renderTableActions={(selectedItems) => (
        <TableActions selectedItems={selectedItems} />
      )}
      data-cy="access-tokens-datatable"
    />
  );
}
