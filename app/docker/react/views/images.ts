import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ListView } from '@CE/react/docker/images/ListView/ListView';

export const imagesModule = angular
  .module('portainer.docker.react.views.images', [])
  .component(
    'imagesListView',
    r2a(withUIRouter(withCurrentUser(ListView)), [])
  ).name;
