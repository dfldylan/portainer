import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { EdgeKeyDisplay } from '@CE/react/portainer/environments/ItemView/EdgeKeyDisplay';
import { KVMControl } from '@CE/react/portainer/environments/KvmView/KVMControl';
import { TagsDatatable } from '@CE/react/portainer/environments/TagsView/TagsDatatable';

export const environmentsModule = angular
  .module('portainer.app.react.components.environments', [])
  .component('edgeKeyDisplay', r2a(EdgeKeyDisplay, ['edgeKey']))
  .component('kvmControl', r2a(KVMControl, ['deviceId', 'server', 'token']))
  .component('tagsDatatable', r2a(TagsDatatable, ['dataset', 'onRemove'])).name;
