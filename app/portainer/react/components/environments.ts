import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { EdgeKeyDisplay } from '@/react/portainer/environments/ItemView/EdgeKeyDisplay';
import { KVMControl } from '@/react/portainer/environments/KvmView/KVMControl';
import { TagsDatatable } from '@/react/portainer/environments/TagsView/TagsDatatable';
import { AzureEndpointConfigSection } from '@/react/portainer/environments/ItemView/AzureEndpointConfigSection/AzureEndpointConfigSection';
import { EnvironmentBasicConfigSection } from '@/react/portainer/environments/ItemView/EnvironmentBasicConfigSection/EnvironmentBasicConfigSection';

export const environmentsModule = angular
  .module('portainer.app.react.components.environments', [])
  .component('edgeKeyDisplay', r2a(EdgeKeyDisplay, ['edgeKey']))
  .component('kvmControl', r2a(KVMControl, ['deviceId', 'server', 'token']))
  .component('tagsDatatable', r2a(TagsDatatable, ['dataset', 'onRemove']))
  .component(
    'azureEndpointConfigSection',
    r2a(AzureEndpointConfigSection, ['values', 'setValues'])
  )
  .component(
    'environmentBasicConfigSection',
    r2a(EnvironmentBasicConfigSection, [
      'values',
      'setValues',
      'isEdge',
      'isAzure',
      'isAgent',
      'hasError',
      'isLocalEnvironment',
    ])
  ).name;
