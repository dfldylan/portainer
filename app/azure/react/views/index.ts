import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { CreateView } from '@CE/react/azure/container-instances/CreateView';
import { ItemView } from '@CE/react/azure/container-instances/ItemView';
import { ListView } from '@CE/react/azure/container-instances/ListView';
import { DashboardView } from '@CE/react/azure/DashboardView';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';

export const viewsModule = angular
  .module('portainer.azure.react.views', [])
  .component(
    'containerInstanceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ItemView))), [])
  )
  .component(
    'createContainerInstanceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(CreateView))), [])
  )
  .component(
    'containerInstancesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ListView))), [])
  )
  .component(
    'dashboardView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(DashboardView))), [])
  ).name;
