import { PageHeader } from '@@CE/PageHeader';

import { ServicesDatatable } from './ServicesDatatable';

export function ServicesView() {
  return (
    <>
      <PageHeader title="Service list" breadcrumbs="Services" reload />
      <ServicesDatatable />
    </>
  );
}
