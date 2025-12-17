import { Table } from '@tanstack/react-table';

import { ServiceViewModel } from '@CE/docker/models/service';

import { TableSettingsMenu } from '@@CE/datatables';
import { TableSettingsMenuAutoRefresh } from '@@CE/datatables/TableSettingsMenuAutoRefresh';
import { ColumnVisibilityMenu } from '@@CE/datatables/ColumnVisibilityMenu';

import { type TableSettings as TableSettingsType } from './types';

export function TableSettings({
  settings,
  table,
}: {
  settings: TableSettingsType;
  table: Table<ServiceViewModel>;
}) {
  return (
    <>
      <ColumnVisibilityMenu<ServiceViewModel>
        table={table}
        onChange={(hiddenColumns) => {
          settings.setHiddenColumns(hiddenColumns);
        }}
        value={settings.hiddenColumns}
      />
      <TableSettingsMenu>
        <TableSettingsMenuAutoRefresh
          value={settings.autoRefreshRate}
          onChange={(value) => settings.setAutoRefreshRate(value)}
        />
      </TableSettingsMenu>
    </>
  );
}
