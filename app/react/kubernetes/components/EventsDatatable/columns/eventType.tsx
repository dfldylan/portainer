import { Row } from '@tanstack/react-table';

import { Event } from '@CE/react/kubernetes/queries/types';

import { Badge, BadgeType } from '@@CE/Badge';
import { filterHOC } from '@@CE/datatables/Filter';

import { columnHelper } from './helper';

export const eventType = columnHelper.accessor('type', {
  header: 'Type',
  cell: ({ getValue }) => (
    <Badge type={getBadgeColor(getValue())}>{getValue()}</Badge>
  ),

  meta: {
    filter: filterHOC('Filter by event type'),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<Event>, _: string, filterValue: string[]) =>
    filterValue.length === 0 ||
    (!!row.original.type && filterValue.includes(row.original.type)),
});

function getBadgeColor(status?: string): BadgeType {
  switch (status?.toLowerCase()) {
    case 'normal':
      return 'info';
    case 'warning':
      return 'warn';
    default:
      return 'danger';
  }
}
