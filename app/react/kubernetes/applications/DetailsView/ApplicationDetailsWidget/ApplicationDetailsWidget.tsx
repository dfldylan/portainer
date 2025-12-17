import { Pencil } from 'lucide-react';
import { useCurrentStateAndParams } from '@uirouter/react';
import { Pod } from 'kubernetes-types/core/v1';

import { Authorized, useIsEdgeAdmin } from '@CE/react/hooks/useUser';
import { useNamespaceQuery } from '@CE/react/kubernetes/namespaces/queries/useNamespaceQuery';

import { Widget, WidgetBody } from '@@CE/Widget';
import { AddButton, Button } from '@@CE/buttons';
import { Link } from '@@CE/Link';
import { Icon } from '@@CE/Icon';

import { applicationIsKind, isExternalApplication } from '../../utils';
import { appStackIdLabel, appStackKindLabel } from '../../constants';
import { useApplication } from '../../queries/useApplication';
import { useApplicationServices } from '../../queries/useApplicationServices';
import { useAppStackFile } from '../../queries/useAppStackFile';
import { Application } from '../../types';

import { RestartApplicationButton } from './RestartApplicationButton';
import { RedeployApplicationButton } from './RedeployApplicationButton';
import { RollbackApplicationButton } from './RollbackApplicationButton';
import { ApplicationServicesTable } from './ApplicationServicesTable';
import { ApplicationIngressesTable } from './ApplicationIngressesTable';
import { ApplicationAutoScalingTable } from './ApplicationAutoScalingTable';
import { ApplicationEnvVarsTable } from './ApplicationEnvVarsTable';
import { ApplicationVolumeConfigsTable } from './ApplicationVolumeConfigsTable';
import { ApplicationPersistentDataTable } from './ApplicationPersistentDataTable';
import { PlacementsTable } from './PlacementsTable';

export function ApplicationDetailsWidget() {
  const stateAndParams = useCurrentStateAndParams();
  const {
    params: {
      namespace,
      name,
      'resource-type': resourceType,
      endpointId: environmentId,
    },
  } = stateAndParams;

  const namespaceData = useNamespaceQuery(environmentId, namespace);
  const isSystemNamespace = namespaceData.data?.IsSystem;

  // check if user is edge admin
  const edgeAdminQuery = useIsEdgeAdmin();

  // get app info
  const { data: app } = useApplication(
    environmentId,
    namespace,
    name,
    resourceType
  );

  const { stackId: appStackId, stackKind: appStackKind } =
    getStackDetailsFromLabels(app);

  const externalApp = app && isExternalApplication(app);

  // Use a single query hook that resolves to the stack file content (string)
  // Only fetch stack file for directly managed apps
  const appStackFileQuery = useAppStackFile(
    !externalApp && appStackKind !== 'edge' ? appStackId : undefined,
    appStackKind
  );
  const appStackFileContent = appStackFileQuery.data;

  const { data: appServices } = useApplicationServices(
    environmentId,
    namespace,
    name,
    app
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            {!isSystemNamespace && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Authorized authorizations="K8sApplicationDetailsW">
                  <Link
                    to={
                      appStackKind === 'edge'
                        ? 'edge.stacks.edit'
                        : 'kubernetes.applications.application.edit'
                    }
                    params={
                      appStackKind === 'edge'
                        ? { stackId: appStackId }
                        : undefined
                    }
                    data-cy="k8sAppDetail-editAppLink"
                  >
                    <Button
                      type="button"
                      color="light"
                      size="small"
                      className="hover:decoration-none !ml-0"
                      data-cy="k8sAppDetail-editAppButton"
                      disabled={
                        edgeAdminQuery.isLoading || !edgeAdminQuery.isAdmin
                      }
                    >
                      <Icon icon={Pencil} className="mr-1" />
                      {externalApp
                        ? 'Edit external application'
                        : 'Edit this application'}
                    </Button>
                  </Link>
                </Authorized>
                {!applicationIsKind<Pod>('Pod', app) && (
                  <>
                    <RestartApplicationButton />
                    <RedeployApplicationButton
                      environmentId={environmentId}
                      namespace={namespace}
                      appName={name}
                      app={app}
                    />
                  </>
                )}
                {!externalApp && (
                  <RollbackApplicationButton
                    environmentId={environmentId}
                    namespace={namespace}
                    appName={name}
                    app={app}
                  />
                )}
                {appStackFileContent && (
                  <AddButton
                    to="kubernetes.templates.custom.new"
                    data-cy="k8sAppDetail-createCustomTemplateButton"
                    params={{
                      fileContent: appStackFileContent,
                    }}
                  >
                    Create template from application
                  </AddButton>
                )}
              </div>
            )}
            <ApplicationServicesTable
              environmentId={environmentId}
              appServices={appServices}
            />
            <ApplicationIngressesTable
              appServices={appServices}
              environmentId={environmentId}
              namespace={namespace}
            />
            <ApplicationAutoScalingTable
              environmentId={environmentId}
              namespace={namespace}
              appName={name}
              app={app}
            />
            <ApplicationEnvVarsTable namespace={namespace} app={app} />
            <ApplicationVolumeConfigsTable namespace={namespace} app={app} />
            <ApplicationPersistentDataTable
              environmentId={environmentId}
              namespace={namespace}
              appName={name}
              app={app}
            />
            {!externalApp && <PlacementsTable app={app} />}
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}

function getStackDetailsFromLabels(app?: Application): {
  stackId?: number;
  stackKind?: string;
} {
  // make undefined when missing so hooks don't run with invalid id
  const appStackId = app?.metadata?.labels?.[appStackIdLabel]
    ? Number(app.metadata.labels[appStackIdLabel])
    : undefined;
  const appStackKind = app?.metadata?.labels?.[appStackKindLabel];
  return { stackId: appStackId, stackKind: appStackKind };
}
