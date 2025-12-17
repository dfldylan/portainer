import angular from 'angular';

import { AngularSidebarService } from '@CE/react/sidebar/useSidebarState';
import { Sidebar } from '@CE/react/sidebar/Sidebar';
import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';

export const sidebarModule = angular
  .module('portainer.app.sidebar', [])
  .component(
    'sidebar',
    r2a(withUIRouter(withReactQuery(withCurrentUser(Sidebar))), [])
  )
  .factory('SidebarService', AngularSidebarService).name;
