import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { AccessDatatable } from '@CE/react/portainer/access-control/AccessManagement/AccessDatatable/AccessDatatable';

export const rbacModule = angular
  .module('portainer.app.react.components.rbac', [])
  .component(
    'accessDatatable',
    r2a(withUIRouter(withReactQuery(AccessDatatable)), [
      'dataset',
      'inheritFrom',
      'isUpdateEnabled',
      'onRemove',
      'onUpdate',
      'showRoles',
      'showWarning',
      'tableKey',
    ])
  ).name;
