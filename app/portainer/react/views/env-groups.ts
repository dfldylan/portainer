import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ListView } from '@CE/react/portainer/environments/environment-groups/ListView';

export const environmentGroupModule = angular
  .module('portainer.app.react.views.environment-groups', [])
  .component(
    'environmentGroupsListView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ListView))), [])
  ).name;
