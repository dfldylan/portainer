import { PageHeader } from '@@CE/PageHeader';

import { EnvironmentGroupsDatatable } from './EnvironmentGroupsDatatable';

export function ListView() {
  return (
    <>
      <PageHeader
        title="Environment Groups"
        breadcrumbs="Environment group management"
        reload
      />

      <EnvironmentGroupsDatatable />
    </>
  );
}
