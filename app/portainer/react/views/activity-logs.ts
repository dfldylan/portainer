import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ActivityLogsView } from '@CE/react/portainer/logs/ActivityLogsView/ActivityLogsView';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';

export const activityLogsModule = angular
  .module('portainer.app.react.views.activity-logs', [])
  .component(
    'activityLogsView',
    r2a(withUIRouter(withCurrentUser(ActivityLogsView)), [])
  ).name;
