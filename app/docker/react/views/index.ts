import angular from 'angular';

import { ItemView as NetworksItemView } from '@CE/react/docker/networks/ItemView';
import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { DashboardView } from '@CE/react/docker/DashboardView/DashboardView';
import { ListView } from '@CE/react/docker/events/ListView';

import { containersModule } from './containers';
import { configsModule } from './configs';
import { imagesModule } from './images';
import { stacksModule } from './stacks';

export const viewsModule = angular
  .module('portainer.docker.react.views', [
    containersModule,
    configsModule,
    imagesModule,
    stacksModule,
  ])
  .component(
    'dockerDashboardView',
    r2a(withUIRouter(withCurrentUser(DashboardView)), [])
  )
  .component('eventsListView', r2a(withUIRouter(withCurrentUser(ListView)), []))
  .component(
    'networkDetailsView',
    r2a(withUIRouter(withCurrentUser(NetworksItemView)), [])
  ).name;
