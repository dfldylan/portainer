import { useCurrentStateAndParams } from '@uirouter/react';

import { useUnauthorizedRedirect } from '@CE/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@CE/PageHeader';

import { NamespaceDetailsWidget } from './NamespaceDetailsWidget';
import { AccessDatatable } from './AccessDatatable/AccessDatatable';
import { CreateAccessWidget } from './CreateAccessWidget/CreateAccessWidget';

export function AccessView() {
  const {
    params: { id: namespaceName },
  } = useCurrentStateAndParams();
  useUnauthorizedRedirect(
    { authorizations: ['K8sResourcePoolDetailsW'] },
    { to: 'kubernetes.resourcePools' }
  );
  return (
    <>
      <PageHeader
        title="Namespace access management"
        breadcrumbs={[
          { label: 'Namespaces', link: 'kubernetes.resourcePools' },
          {
            label: namespaceName,
            link: 'kubernetes.resourcePools.resourcePool',
            linkParams: { id: namespaceName },
          },
          'Access management',
        ]}
        reload
      />
      <NamespaceDetailsWidget />
      <CreateAccessWidget />
      <AccessDatatable />
    </>
  );
}
