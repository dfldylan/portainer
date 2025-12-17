import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { NodesDatatable } from '@CE/react/docker/swarm/SwarmView/NodesDatatable';

export const swarmModule = angular
  .module('portainer.docker.react.components.swarm', [])
  .component(
    'nodesDatatable',
    r2a(withUIRouter(NodesDatatable), [
      'dataset',
      'isIpColumnVisible',
      'haveAccessToNode',
      'onRefresh',
    ])
  ).name;
