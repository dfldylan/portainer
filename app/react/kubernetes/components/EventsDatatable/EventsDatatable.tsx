import { History } from 'lucide-react';
import { ReactNode } from 'react';

import { Event } from '@CE/react/kubernetes/queries/types';
import { IndexOptional } from '@CE/react/kubernetes/configs/types';
import { TableSettings } from '@CE/react/kubernetes/datatables/DefaultDatatableSettings';

import { Datatable, TableSettingsMenu } from '@@CE/datatables';
import { TableSettingsMenuAutoRefresh } from '@@CE/datatables/TableSettingsMenuAutoRefresh';
import { TableState } from '@@CE/datatables/useTableState';

import { columns } from './columns';

type Props = {
  dataset: Event[];
  tableState: TableState<TableSettings>;
  isLoading: boolean;
  'data-cy': string;
  noWidget?: boolean;
  title?: ReactNode;
  titleIcon?: ReactNode;
};

export function EventsDatatable({
  dataset,
  tableState,
  isLoading,
  'data-cy': dataCy,
  noWidget,
  title = 'Events',
  titleIcon = History,
}: Props) {
  return (
    <Datatable<IndexOptional<Event>>
      dataset={dataset}
      columns={columns}
      settingsManager={tableState}
      isLoading={isLoading}
      title={title}
      titleIcon={titleIcon}
      getRowId={(row) => row.uid || ''}
      disableSelect
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={tableState.autoRefreshRate}
            onChange={(value) => tableState.setAutoRefreshRate(value)}
          />
        </TableSettingsMenu>
      )}
      data-cy={dataCy}
      noWidget={noWidget}
    />
  );
}
