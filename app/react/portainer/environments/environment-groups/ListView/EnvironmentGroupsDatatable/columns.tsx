import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Users } from 'lucide-react';

import { buildNameColumn } from '@@CE/datatables/buildNameColumn';
import { Button } from '@@CE/buttons';
import { Link } from '@@CE/Link';

import { EnvironmentGroup } from '../../types';

const columnHelper = createColumnHelper<EnvironmentGroup>();

export const columns = [
  buildNameColumn<EnvironmentGroup>('Name', '.group', 'environment-group-name'),
  columnHelper.display({
    header: 'Actions',
    cell: ActionsCell,
  }),
];

function ActionsCell({
  row: { original: item },
}: CellContext<EnvironmentGroup, unknown>) {
  return (
    <Button
      as={Link}
      props={{
        to: '.group.access',
        params: { id: item.Id },
      }}
      color="link"
      icon={Users}
      data-cy={`manage-access-button_${item.Name}`}
    >
      Manage access
    </Button>
  );
}
