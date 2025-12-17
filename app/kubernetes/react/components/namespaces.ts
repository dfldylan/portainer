import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { NamespacesDatatable } from '@CE/react/kubernetes/namespaces/ListView/NamespacesDatatable';

export const namespacesModule = angular
  .module('portainer.kubernetes.react.components.namespaces', [])
  .component(
    'kubernetesNamespacesDatatable',
    r2a(withUIRouter(withCurrentUser(NamespacesDatatable)), [])
  ).name;
