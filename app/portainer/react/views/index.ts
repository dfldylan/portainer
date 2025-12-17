import angular from 'angular';

import { HomeView } from '@CE/react/portainer/HomeView';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { r2a } from '@CE/react-tools/react2angular';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { CreateUserAccessToken } from '@CE/react/portainer/account/CreateAccessTokenView';
import { EdgeComputeSettingsView } from '@CE/react/portainer/settings/EdgeComputeView/EdgeComputeSettingsView';
import { EdgeAutoCreateScriptView } from '@CE/react/portainer/environments/EdgeAutoCreateScriptView';
import { ListView as EnvironmentsListView } from '@CE/react/portainer/environments/ListView';
import { BackupSettingsPanel } from '@CE/react/portainer/settings/SettingsView/BackupSettingsView/BackupSettingsPanel';
import { SettingsView } from '@CE/react/portainer/settings/SettingsView/SettingsView';
import { CreateHelmRepositoriesView } from '@CE/react/portainer/account/helm-repositories/CreateHelmRepositoryView';

import { wizardModule } from './wizard';
import { teamsModule } from './teams';
import { updateSchedulesModule } from './update-schedules';
import { environmentGroupModule } from './env-groups';
import { registriesModule } from './registries';
import { activityLogsModule } from './activity-logs';
import { templatesModule } from './templates';
import { usersModule } from './users';

export const viewsModule = angular
  .module('portainer.app.react.views', [
    wizardModule,
    teamsModule,
    updateSchedulesModule,
    environmentGroupModule,
    registriesModule,
    activityLogsModule,
    templatesModule,
    usersModule,
  ])
  .component(
    'homeView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(HomeView))), [])
  )
  .component(
    'edgeAutoCreateScriptView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(EdgeAutoCreateScriptView))),
      []
    )
  )
  .component(
    'createUserAccessToken',
    r2a(
      withReactQuery(withCurrentUser(withUIRouter(CreateUserAccessToken))),
      []
    )
  )
  .component(
    'settingsEdgeCompute',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(EdgeComputeSettingsView))),
      ['onSubmit', 'settings']
    )
  )
  .component(
    'environmentsListView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(EnvironmentsListView))), [])
  )
  .component(
    'backupSettingsPanel',
    r2a(withUIRouter(withReactQuery(withCurrentUser(BackupSettingsPanel))), [])
  )
  .component(
    'settingsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(SettingsView))), [])
  )
  .component(
    'createHelmRepositoryView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(CreateHelmRepositoriesView))),
      []
    )
  ).name;
