import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { EdgeKeyDisplay } from '@/react/portainer/environments/ItemView/EdgeKeyDisplay';
import { EdgeAgentDeploymentWidget } from '@/react/portainer/environments/ItemView/EdgeAgentDeploymentWidget/EdgeAgentDeploymentWidget';
import { KVMControl } from '@/react/portainer/environments/KvmView/KVMControl';
import { TagsDatatable } from '@/react/portainer/environments/TagsView/TagsDatatable';
import { AzureEndpointConfigSection } from '@/react/portainer/environments/ItemView/AzureEndpointConfigSection/AzureEndpointConfigSection';
import { EnvironmentBasicConfigSection } from '@/react/portainer/environments/ItemView/EnvironmentBasicConfigSection/EnvironmentBasicConfigSection';
import { EdgeInformationPanel } from '@/react/portainer/environments/ItemView/EdgeInformationPanel/EdgeInformationPanel';
import { KubeConfigInfo } from '@/react/portainer/environments/ItemView/KubeConfigInfo/KubeConfigInfo';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';

export const environmentsModule = angular
  .module('portainer.app.react.components.environments', [])
  .component('edgeKeyDisplay', r2a(EdgeKeyDisplay, ['edgeKey']))
  .component(
    'edgeAgentDeploymentWidget',
    r2a(withCurrentUser(withUIRouter(EdgeAgentDeploymentWidget)), [
      'edgeKey',
      'edgeId',
      'asyncMode',
    ])
  )
  .component(
    'kubeConfigInfo',
    r2a(withUIRouter(withReactQuery(KubeConfigInfo)), [
      'environmentId',
      'environmentType',
      'edgeId',
      'status',
    ])
  )
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
  )
  .component(
    'edgeInformationPanel',
    r2a(withUIRouter(withReactQuery(EdgeInformationPanel)), [
      'environmentId',
      'edgeKey',
      'edgeId',
      'platformName',
      'onSuccess',
    ])
  ).name;
