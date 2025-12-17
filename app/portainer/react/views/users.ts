import angular from 'angular';

import { ListView } from '@CE/react/portainer/users/ListView/ListView';
import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';

export const usersModule = angular
  .module('portainer.app.react.views.users', [])

  .component(
    'usersListView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ListView))), [])
  ).name;
