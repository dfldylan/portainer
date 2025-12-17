import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { RepositoriesDatatable } from '@CE/react/portainer/registries/repositories/ListView/RepositoriesDatatable';
import { TagsDatatable } from '@CE/react/portainer/registries/repositories/ItemView/TagsDatatable/TagsDatatable';
import { GitlabProjectTable } from '@CE/react/portainer/registries/CreateView/GitlabProjectsTable/GitlabProjectsTable';
import { RegistryFormDockerhub } from '@CE/react/portainer/registries/CreateView/RegistryFormDockerhub/RegistryFormDockerhub';

export const registriesModule = angular
  .module('portainer.app.react.components.registries', [])
  .component(
    'registryRepositoriesDatatable',
    r2a(withUIRouter(withReactQuery(RepositoriesDatatable)), ['dataset'])
  )
  .component(
    'registriesRepositoryTagsDatatable',
    r2a(withUIRouter(withReactQuery(TagsDatatable)), [
      'dataset',
      'advancedFeaturesAvailable',
      'onRemove',
      'onRetag',
    ])
  )
  .component(
    'gitlabProjectSelector',
    r2a(GitlabProjectTable, ['dataset', 'onChange', 'value'])
  )
  .component(
    'registryFormDockerhub',
    r2a(withReactQuery(RegistryFormDockerhub), [
      'initialValues',
      'onSubmit',
      'submitLabel',
      'isLoading',
      'nameIsUsed',
    ])
  ).name;
