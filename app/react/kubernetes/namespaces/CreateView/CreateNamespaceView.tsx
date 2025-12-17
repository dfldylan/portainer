import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { isBE } from '@CE/react/portainer/feature-flags/feature-flags.service';
import { useUnauthorizedRedirect } from '@CE/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@CE/PageHeader';

import { CreateNamespaceForm } from './CreateNamespaceForm';

export function CreateNamespaceView() {
  const environmentId = useEnvironmentId();

  useUnauthorizedRedirect(
    {
      authorizations: 'K8sResourcePoolsW',
      adminOnlyCE: !isBE,
    },
    {
      to: 'kubernetes.resourcePools',
      params: {
        id: environmentId,
      },
    }
  );

  return (
    <div className="form-horizontal">
      <PageHeader
        title="Create a namespace"
        breadcrumbs={[
          { label: 'Namespaces', link: 'kubernetes.resourcePools' },
          'Create a namespace',
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <CreateNamespaceForm />
        </div>
      </div>
    </div>
  );
}
