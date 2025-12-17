import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { EffectiveAccessViewerDatatable } from '@CE/react/portainer/users/RolesView/AccessViewer/EffectiveAccessViewerDatatable';
import { RbacRolesDatatable } from '@CE/react/portainer/users/RolesView/RbacRolesDatatable';

export const usersModule = angular
  .module('portainer.app.react.components.users', [])
  .component(
    'effectiveAccessViewerDatatable',
    r2a(withUIRouter(withCurrentUser(EffectiveAccessViewerDatatable)), [
      'dataset',
    ])
  )
  .component('rbacRolesDatatable', r2a(RbacRolesDatatable, ['dataset'])).name;
