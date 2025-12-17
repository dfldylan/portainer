import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { AuthenticationLogsTable } from '@CE/react/portainer/logs/AuthenticationLogsView/AuthenticationLogsTable';

export const activityLogsModule = angular
  .module('portainer.app.react.components.activity-logs', [])
  .component(
    'authenticationLogsTable',
    r2a(withUIRouter(withReactQuery(AuthenticationLogsTable)), [
      'currentPage',
      'dataset',
      'keyword',
      'limit',
      'totalItems',
      'sort',
      'onChangeSort',
      'onChangePage',
      'onChangeLimit',
      'onChangeKeyword',
    ])
  ).name;
