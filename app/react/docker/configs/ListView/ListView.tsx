import { PageHeader } from '@@CE/PageHeader';

import { ConfigsDatatable } from './ConfigsDatatable/ConfigsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="Configs list" breadcrumbs="Configs" reload />

      <ConfigsDatatable />
    </>
  );
}
