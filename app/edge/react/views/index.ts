import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { WaitingRoomView } from '@CE/react/edge/edge-devices/WaitingRoomView';

import { templatesModule } from './templates';
import { jobsModule } from './jobs';
import { stacksModule } from './edge-stacks';
import { groupsModule } from './groups';

export const viewsModule = angular
  .module('portainer.edge.react.views', [
    templatesModule,
    jobsModule,
    stacksModule,
    groupsModule,
  ])
  .component(
    'waitingRoomView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(WaitingRoomView))), [])
  ).name;
