import angular from 'angular';
import { StateRegistry } from '@uirouter/angularjs';

import { ItemView, ListView } from '@CE/react/portainer/users/teams';
import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { AccessHeaders } from '@CE/portainer/authorization-guard';

export const teamsModule = angular
  .module('portainer.app.teams', [])
  .config(config)
  .component(
    'teamView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ItemView))), [])
  )
  .component(
    'teamsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ListView))), [])
  ).name;

/* @ngInject */
function config($stateRegistryProvider: StateRegistry) {
  $stateRegistryProvider.register({
    name: 'portainer.teams',
    url: '/teams',
    views: {
      'content@': {
        component: 'teamsView',
      },
    },
    data: {
      docs: '/admin/user/teams',
      access: AccessHeaders.Restricted, // allow for team leaders
    },
  });

  $stateRegistryProvider.register({
    name: 'portainer.teams.team',
    url: '/:id',
    views: {
      'content@': {
        component: 'teamView',
      },
    },
  });
}
