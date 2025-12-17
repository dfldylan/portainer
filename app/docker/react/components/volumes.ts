import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { VolumesDatatable } from '@CE/react/docker/volumes/ListView/VolumesDatatable';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';

export const volumesModule = angular
  .module('portainer.docker.react.components.volumes', [])
  .component(
    'volumesDatatable',
    r2a(withUIRouter(withCurrentUser(VolumesDatatable)), [
      'dataset',
      'onRemove',
      'onRefresh',
      'isBrowseVisible',
    ])
  ).name;
