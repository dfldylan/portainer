import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';

import { NestedDatatable } from '@@CE/datatables/NestedDatatable';

import { useIsSwarm } from '../../proxy/queries/useInfo';

import { useColumns } from './columns';
import { DecoratedNetwork } from './types';

export function NestedNetworksDatatable({
  dataset,
}: {
  dataset: Array<DecoratedNetwork>;
}) {
  const environmentId = useEnvironmentId();
  const isSwarm = useIsSwarm(environmentId);

  const columns = useColumns(isSwarm);
  return (
    <NestedDatatable
      columns={columns}
      dataset={dataset}
      aria-label="Networks table"
      data-cy="docker-networks-nested-datatable"
    />
  );
}
