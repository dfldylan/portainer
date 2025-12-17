import { Book } from 'lucide-react';

import { Datatable } from '@@CE/datatables';
import { useTableStateWithStorage } from '@@CE/datatables/useTableState';

import { Repository } from './types';
import { columns } from './columns';

export function RepositoriesDatatable({ dataset }: { dataset?: Repository[] }) {
  const tableState = useTableStateWithStorage('registryRepositories');
  return (
    <Datatable
      title="Repositories"
      titleIcon={Book}
      columns={columns}
      dataset={dataset || []}
      isLoading={!dataset}
      settingsManager={tableState}
      disableSelect
      data-cy="registry-repositories-datatable"
    />
  );
}
