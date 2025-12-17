import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { CreateView } from '@CE/react/edge/edge-stacks/CreateView/CreateView';
import { ItemView } from '@CE/react/edge/edge-stacks/ItemView/ItemView';
import { ListView } from '@CE/react/edge/edge-stacks/ListView';

export const stacksModule = angular
  .module('portainer.edge.react.views.stacks', [])
  .component(
    'edgeStacksCreateView',
    r2a(withCurrentUser(withUIRouter(CreateView)), [])
  )
  .component(
    'edgeStacksItemView',
    r2a(withCurrentUser(withUIRouter(ItemView)), [])
  )
  .component(
    'edgeStacksView',
    r2a(withUIRouter(withCurrentUser(ListView)), [])
  ).name;
