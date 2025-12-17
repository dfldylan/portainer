import { isoDate } from '@CE/portainer/filters/filters';

import { columnHelper } from './helper';

export const updated = columnHelper.accessor('Updated', {
  header: 'Last Update',
  cell: ({ getValue }) => isoDate(getValue()),
});
