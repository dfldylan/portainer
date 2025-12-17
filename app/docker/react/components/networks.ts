import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { MacvlanNodesSelector } from '@CE/react/docker/networks/CreateView/MacvlanNodesSelector/MacvlanNodesSelector';
import { withUIRouter } from '@CE/react-tools/withUIRouter';

export const networksModule = angular
  .module('portainer.docker.react.components.networks', [])
  .component(
    'macvlanNodesSelector',
    r2a(withUIRouter(MacvlanNodesSelector), [
      'dataset',
      'isIpColumnVisible',
      'haveAccessToNode',
      'value',
      'onChange',
    ])
  ).name;
