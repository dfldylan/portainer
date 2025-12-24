import angular from 'angular';

import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { r2a } from '@/react-tools/react2angular';
import { ContainerNetworksDatatable } from '@/react/docker/containers/ItemView/ContainerNetworksDatatable';
import { RestartPolicySection } from '@/react/docker/containers/ItemView/RestartPolicySection/RestartPolicySection';

const ngModule = angular
  .module('portainer.docker.react.components.containers', [])
  .component(
    'dockerContainerNetworksDatatable',
    r2a(withUIRouter(withCurrentUser(ContainerNetworksDatatable)), [
      'container',
      'dataset',
      'nodeName',
    ])
  )
  .component(
    'containerRestartPolicy',
    r2a(withUIRouter(withCurrentUser(RestartPolicySection)), [
      'environmentId',
      'containerId',
      'nodeName',
      'name',
      'maximumRetryCount',
      'onUpdateSuccess',
    ])
  );

export const containersModule = ngModule.name;
