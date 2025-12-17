import { PageHeader } from '@@CE/PageHeader';

import { NamespacesDatatable } from './NamespacesDatatable';

export function NamespacesView() {
  return (
    <>
      <PageHeader title="Namespace list" breadcrumbs="Namespaces" reload />
      <NamespacesDatatable />
    </>
  );
}
