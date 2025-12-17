import { CellContext } from '@tanstack/react-table';

import { isExternalApplication } from '@CE/react/kubernetes/applications/utils';
import { useIsSystemNamespace } from '@CE/react/kubernetes/namespaces/queries/useIsSystemNamespace';
import { Application } from '@CE/react/kubernetes/applications/ListView/ApplicationsDatatable/types';

import { Link } from '@@CE/Link';
import { SystemBadge } from '@@CE/Badge/SystemBadge';
import { ExternalBadge } from '@@CE/Badge/ExternalBadge';

import { helper } from './columns.helper';

export const name = helper.accessor('Name', {
  header: 'Name',
  cell: Cell,
});

function Cell({ row: { original: item } }: CellContext<Application, string>) {
  const isSystem = useIsSystemNamespace(item.ResourcePool);
  return (
    <div className="flex items-center gap-2">
      <Link
        to="kubernetes.applications.application"
        params={{ name: item.Name, namespace: item.ResourcePool }}
        data-cy={`application-link-${item.Name}`}
      >
        {item.Name}
      </Link>

      {isSystem ? (
        <SystemBadge className="ml-auto" />
      ) : (
        isExternalApplication({ metadata: item.Metadata }) && (
          <ExternalBadge className="ml-auto" />
        )
      )}
    </div>
  );
}
