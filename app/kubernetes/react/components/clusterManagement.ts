import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { NodeApplicationsDatatable } from '@CE/react/kubernetes/cluster/NodeView/NodeApplicationsDatatable/NodeApplicationsDatatable';
import { ResourceEventsDatatable } from '@CE/react/kubernetes/components/EventsDatatable/ResourceEventsDatatable';
import { withReactQuery } from '@CE/react-tools/withReactQuery';

export const clusterManagementModule = angular
  .module('portainer.kubernetes.react.components.clusterManagement', [])
  .component(
    'kubernetesNodeApplicationsDatatable',
    r2a(withUIRouter(withCurrentUser(NodeApplicationsDatatable)), [])
  )
  .component(
    'resourceEventsDatatable',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ResourceEventsDatatable))),
      ['resourceId', 'storageKey', 'namespace', 'noWidget', 'isLoading']
    )
  ).name;
