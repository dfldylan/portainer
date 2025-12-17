import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { AccessTable } from '@CE/react/kubernetes/cluster/RegistryAccessView/AccessTable';

export const registriesModule = angular
  .module('portainer.kubernetes.react.components.registries', [])
  .component(
    'kubeRegistryAccessTable',
    r2a(AccessTable, ['dataset', 'onRemove'])
  ).name;
