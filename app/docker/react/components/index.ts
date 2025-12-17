import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withControlledInput } from '@CE/react-tools/withControlledInput';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { DockerfileDetails } from '@CE/react/docker/images/ItemView/DockerfileDetails';
import { HealthStatus } from '@CE/react/docker/containers/ItemView/HealthStatus';
import { GpusList } from '@CE/react/docker/host/SetupView/GpusList';
import { InsightsBox } from '@CE/react/components/InsightsBox';
import { BetaAlert } from '@CE/react/portainer/environments/update-schedules/common/BetaAlert';
import { EventsDatatable } from '@CE/react/docker/events/EventsDatatables';
import { AgentHostBrowser } from '@CE/react/docker/host/BrowseView/AgentHostBrowser';
import { AgentVolumeBrowser } from '@CE/react/docker/volumes/BrowseView/AgentVolumeBrowser';
import { ProcessesDatatable } from '@CE/react/docker/containers/StatsView/ProcessesDatatable';
import { SecretsDatatable } from '@CE/react/docker/secrets/ListView/SecretsDatatable';
import { StacksDatatable } from '@CE/react/docker/stacks/ListView/StacksDatatable';
import { NetworksDatatable } from '@CE/react/docker/networks/ListView/NetworksDatatable';

import { containersModule } from './containers';
import { servicesModule } from './services';
import { networksModule } from './networks';
import { swarmModule } from './swarm';
import { volumesModule } from './volumes';
import { templatesModule } from './templates';

const ngModule = angular
  .module('portainer.docker.react.components', [
    containersModule,
    servicesModule,
    networksModule,
    swarmModule,
    volumesModule,
    templatesModule,
  ])
  .component('dockerfileDetails', r2a(DockerfileDetails, ['image']))
  .component('dockerHealthStatus', r2a(HealthStatus, ['health']))
  .component(
    'networksDatatable',
    r2a(withUIRouter(withCurrentUser(NetworksDatatable)), [
      'dataset',
      'onRefresh',
      'onRemove',
    ])
  )
  .component(
    'gpusList',
    r2a(withControlledInput(GpusList), ['value', 'onChange'])
  )
  .component(
    'insightsBox',
    r2a(InsightsBox, [
      'header',
      'content',
      'insightCloseId',
      'type',
      'className',
    ])
  )
  .component('betaAlert', r2a(BetaAlert, ['className', 'message', 'isHtml']))
  .component(
    'agentHostBrowserReact',
    r2a(withUIRouter(withCurrentUser(AgentHostBrowser)), [
      'dataset',
      'isRoot',
      'onBrowse',
      'onDelete',
      'onDownload',
      'onFileSelectedForUpload',
      'onGoToParent',
      'onRename',
      'relativePath',
    ])
  )
  .component(
    'agentVolumeBrowserReact',
    r2a(withUIRouter(withCurrentUser(AgentVolumeBrowser)), [
      'dataset',
      'isRoot',
      'isUploadAllowed',
      'onBrowse',
      'onDelete',
      'onDownload',
      'onFileSelectedForUpload',
      'onGoToParent',
      'onRename',
      'relativePath',
    ])
  )
  .component(
    'dockerContainerProcessesDatatable',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ProcessesDatatable))), [])
  )
  .component('dockerEventsDatatable', r2a(EventsDatatable, ['dataset']))
  .component(
    'dockerSecretsDatatable',
    r2a(withUIRouter(withCurrentUser(SecretsDatatable)), [
      'dataset',
      'onRefresh',
      'onRemove',
    ])
  )
  .component(
    'dockerStacksDatatable',
    r2a(withUIRouter(withCurrentUser(StacksDatatable)), [
      'dataset',
      'isImageNotificationEnabled',
      'onReload',
      'onRemove',
    ])
  );
export const componentsModule = ngModule.name;
