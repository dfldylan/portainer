import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { ListView } from '@CE/react/portainer/registries/ListView';
import { ListView as EnvironmentListView } from '@CE/react/portainer/registries/environments/ListView';

export const registriesModule = angular
  .module('portainer.app.react.views.registries', [])
  .component(
    'registriesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ListView))), [])
  )
  .component(
    'environmentRegistriesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(EnvironmentListView))), [])
  ).name;
