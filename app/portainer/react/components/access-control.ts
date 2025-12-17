import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { PorAccessControlFormTeamSelector } from '@CE/react/portainer/access-control/PorAccessControlForm/TeamsSelector';
import { PorAccessControlFormUserSelector } from '@CE/react/portainer/access-control/PorAccessControlForm/UsersSelector';
import { PorAccessManagementUsersSelector } from '@CE/react/portainer/access-control/AccessManagement/PorAccessManagementUsersSelector';
import { AccessTypeSelector } from '@CE/react/portainer/access-control/EditDetails/AccessTypeSelector';
import { AccessControlPanel } from '@CE/react/portainer/access-control';

export const accessControlModule = angular
  .module('portainer.app.react.components.access-control', [])
  .component(
    'accessControlPanel',
    r2a(withUIRouter(withReactQuery(withCurrentUser(AccessControlPanel))), [
      'disableOwnershipChange',
      'onUpdateSuccess',
      'resourceControl',
      'resourceId',
      'resourceType',
      'environmentId',
    ])
  )
  .component(
    'accessTypeSelector',
    r2a(AccessTypeSelector, [
      'isAdmin',
      'isPublicVisible',
      'name',
      'onChange',
      'value',
      'teams',
    ])
  )
  .component(
    'porAccessControlFormTeamSelector',
    r2a(PorAccessControlFormTeamSelector, [
      'inputId',
      'onChange',
      'options',
      'value',
    ])
  )
  .component(
    'porAccessControlFormUserSelector',
    r2a(PorAccessControlFormUserSelector, [
      'inputId',
      'onChange',
      'options',
      'value',
    ])
  )
  .component(
    'porAccessManagementUsersSelector',
    r2a(PorAccessManagementUsersSelector, ['onChange', 'options', 'value'])
  ).name;
