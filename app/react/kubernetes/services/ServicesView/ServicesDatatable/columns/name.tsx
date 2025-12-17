import { Authorized } from '@CE/react/hooks/useUser';

import { SystemBadge } from '@@CE/Badge/SystemBadge';
import { ExternalBadge } from '@@CE/Badge/ExternalBadge';

import { columnHelper } from './helper';

export const name = columnHelper.accessor(
  (row) => {
    let name = row.Name;

    const isExternal =
      !row.Labels || !row.Labels['io.portainer.kubernetes.application.owner'];

    if (isExternal && !row.IsSystem) {
      name = `${name} external`;
    }

    if (row.IsSystem) {
      name = `${name} system`;
    }
    return name;
  },
  {
    header: 'Name',
    id: 'name',
    cell: ({ row }) => {
      const name = row.original.Name;

      const isExternal =
        !row.original.Labels ||
        !row.original.Labels['io.portainer.kubernetes.application.owner'];

      return (
        <div className="flex gap-2">
          <Authorized authorizations="K8sServiceW" childrenUnauthorized={name}>
            {name}

            <div className="ml-auto flex gap-2">
              {row.original.IsSystem && <SystemBadge />}
              {isExternal && !row.original.IsSystem && <ExternalBadge />}
            </div>
          </Authorized>
        </div>
      );
    },
  }
);
