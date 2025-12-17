import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ListView } from '@CE/react/edge/edge-groups/ListView';
import { CreateView } from '@CE/react/edge/edge-groups/CreateView/CreateView';
import { ItemView } from '@CE/react/edge/edge-groups/ItemView/ItemView';

export const groupsModule = angular
  .module('portainer.edge.react.views.groups', [])
  .component('edgeGroupsView', r2a(withUIRouter(withCurrentUser(ListView)), []))
  .component(
    'edgeGroupsCreateView',
    r2a(withUIRouter(withCurrentUser(CreateView)), [])
  )
  .component(
    'edgeGroupsItemView',
    r2a(withUIRouter(withCurrentUser(ItemView)), [])
  ).name;
