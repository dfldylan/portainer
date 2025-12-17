import angular from 'angular';

import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { r2a } from '@CE/react-tools/react2angular';
import { ContainerNetworksDatatable } from '@CE/react/docker/containers/ItemView/ContainerNetworksDatatable';

const ngModule = angular
  .module('portainer.docker.react.components.containers', [])
  .component(
    'dockerContainerNetworksDatatable',
    r2a(withUIRouter(withCurrentUser(ContainerNetworksDatatable)), [
      'container',
      'dataset',
      'nodeName',
    ])
  );

export const containersModule = ngModule.name;
