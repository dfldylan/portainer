import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ItemView } from '@CE/react/docker/stacks/ItemView/ItemView';

export const stacksModule = angular
  .module('portainer.docker.stacks', [])
  .component(
    'stackItemView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ItemView))), [])
  ).name;
