import { Radio } from 'lucide-react';

import { useEnvironmentRegistries } from '@CE/react/portainer/environments/queries/useEnvironmentRegistries';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { url } from '@CE/react/portainer/registries/ListView/RegistriesDatatable/columns/url';
import { AddButton } from '@CE/react/portainer/registries/ListView/RegistriesDatatable/AddButton';

import { Datatable } from '@@CE/datatables';
import { createPersistedStore } from '@@CE/datatables/types';
import { useTableState } from '@@CE/datatables/useTableState';

import { name } from './columns/name';
import { actions } from './columns/actions';

const columns = [name, url, actions];

const tableKey = 'registries';

const store = createPersistedStore(tableKey);

export function EnvironmentRegistriesDatatable() {
  const environmentId = useEnvironmentId();
  const query = useEnvironmentRegistries(environmentId);

  const tableState = useTableState(store, tableKey);

  return (
    <Datatable
      columns={columns}
      dataset={query.data || []}
      isLoading={query.isLoading}
      settingsManager={tableState}
      title="Registries"
      titleIcon={Radio}
      renderTableActions={() => <AddButton />}
      disableSelect
      data-cy="environment-registries-datatable"
    />
  );
}
