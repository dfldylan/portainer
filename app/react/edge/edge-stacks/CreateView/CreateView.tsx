import { PageHeader } from '@@CE/PageHeader';

import { CreateForm } from './CreateForm';

export function CreateView() {
  return (
    <>
      <PageHeader
        title="Create Edge Stack"
        breadcrumbs={[
          { label: 'Edge Stacks', link: 'edge.stacks' },
          'Create Edge Stack',
        ]}
        reload
      />

      <CreateForm />
    </>
  );
}
