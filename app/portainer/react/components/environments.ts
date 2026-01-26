import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { EdgeKeyDisplay } from '@/react/portainer/environments/ItemView/EdgeKeyDisplay';
import { EdgeAgentDeploymentWidget } from '@/react/portainer/environments/ItemView/EdgeAgentDeploymentWidget/EdgeAgentDeploymentWidget';
import { KVMControl } from '@/react/portainer/environments/KvmView/KVMControl';
import { TagsDatatable } from '@/react/portainer/environments/TagsView/TagsDatatable';
import { EnvironmentBasicConfigSection } from '@/react/portainer/environments/ItemView/EnvironmentBasicConfigSection/EnvironmentBasicConfigSection';
import { EdgeInformationPanel } from '@/react/portainer/environments/ItemView/EdgeInformationPanel/EdgeInformationPanel';
import { KubeConfigInfo } from '@/react/portainer/environments/ItemView/KubeConfigInfo/KubeConfigInfo';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { AzureEnvironmentForm } from '@/react/portainer/environments/ItemView/AzureEnvironmentForm/AzureEnvironmentForm';
import { GeneralEnvironmentForm } from '@/react/portainer/environments/ItemView/GeneralEnvironmentForm/GeneralEnvironmentForm';

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
  )
  .component(
    'azureEnvironmentForm',
    r2a(withUIRouter(withReactQuery(withCurrentUser(AzureEnvironmentForm))), [
      'environment',
      'onSuccess',
    ])
  )
  .component(
    'generalEnvironmentForm',
    r2a(withUIRouter(withReactQuery(withCurrentUser(GeneralEnvironmentForm))), [
      'environment',
      'onSuccess',
    ])
  ).name;
