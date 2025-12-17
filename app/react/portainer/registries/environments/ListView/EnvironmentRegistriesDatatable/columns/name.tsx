import { CellContext } from '@tanstack/react-table';

import { DecoratedRegistry } from '@CE/react/portainer/registries/ListView/RegistriesDatatable/types';
import { columnHelper } from '@CE/react/portainer/registries/ListView/RegistriesDatatable/columns/helper';
import { NameCell } from '@CE/react/portainer/registries/ListView/RegistriesDatatable/columns/name';

export const name = columnHelper.accessor('Name', {
  header: 'Name',
  cell: Cell,
});

function Cell({
  row: { original: item },
}: CellContext<DecoratedRegistry, string>) {
  return <NameCell item={item} />;
}
