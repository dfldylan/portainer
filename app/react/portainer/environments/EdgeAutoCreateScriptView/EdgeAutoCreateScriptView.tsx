import { withLimitToBE } from '@CE/react/hooks/useLimitToBE';

import { PageHeader } from '@@CE/PageHeader';

import { AutomaticEdgeEnvCreation } from './AutomaticEdgeEnvCreation';

export const EdgeAutoCreateScriptViewWrapper = withLimitToBE(
  EdgeAutoCreateScriptView
);

function EdgeAutoCreateScriptView() {
  return (
    <>
      <PageHeader
        title="Automatic Edge Environment Creation"
        breadcrumbs={[
          { label: 'Environments', link: 'portainer.endpoints' },
          'Automatic Edge Environment Creation',
        ]}
        reload
      />

      <div className="mx-3">
        <AutomaticEdgeEnvCreation />
      </div>
    </>
  );
}
