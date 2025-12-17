import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { HelmRepositoryDatatable } from '@CE/react/portainer/account/AccountView/HelmRepositoryDatatable';
import { AccessTokensDatatable } from '@CE/react/portainer/account/AccountView/AccessTokensDatatable';
import { ApplicationSettingsWidget } from '@CE/react/portainer/account/AccountView/ApplicationSettings';

export const accountModule = angular
  .module('portainer.app.react.components.account', [])
  .component(
    'applicationSettingsWidget',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ApplicationSettingsWidget))),
      []
    )
  )
  .component(
    'helmRepositoryDatatable',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(HelmRepositoryDatatable))),
      []
    )
  )
  .component(
    'accessTokensDatatable',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(AccessTokensDatatable))),
      []
    )
  ).name;
