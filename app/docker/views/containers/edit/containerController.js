import moment from 'moment';
import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { ResourceControlType } from '@/react/portainer/access-control/types';
import { commitContainer } from '@/react/docker/proxy/queries/useCommitContainerMutation';
import { ContainerEngine } from '@/react/portainer/environments/types';

angular.module('portainer.docker').controller('ContainerController', [
  '$q',
  '$scope',
  '$state',
  '$transition$',
  '$filter',
  '$async',
  'ContainerService',
  'ImageHelper',
  'Notifications',
  'HttpRequestHelper',
  'Authentication',
  'endpoint',
  function ($q, $scope, $state, $transition$, $filter, $async, ContainerService, ImageHelper, Notifications, HttpRequestHelper, Authentication, endpoint) {
    $scope.resourceType = ResourceControlType.Container;
    $scope.endpoint = endpoint;
    $scope.isAdmin = Authentication.isAdmin();
    $scope.activityTime = 0;
    $scope.portBindings = [];
    $scope.displayRecreateButton = false;
    $scope.displayCreateWebhookButton = false;
    $scope.containerWebhookFeature = FeatureId.CONTAINER_WEBHOOK;

    $scope.onSuccessAction = update;

    $scope.config = {
      RegistryModel: new PorImageRegistryModel(),
      commitInProgress: false,
    };

    $scope.state = {
      pullImageValidity: false,
    };

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullImageValidity = validity;
    }

    $scope.onUpdateRestartPolicySuccess = onUpdateRestartPolicySuccess;
    function onUpdateRestartPolicySuccess(policy) {
      $scope.container.HostConfig.RestartPolicy = {
        Name: policy.name,
        MaximumRetryCount: policy.maximumRetryCount,
      };
    }

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.computeDockerGPUCommand = () => {
      const gpuOptions = _.find($scope.container.HostConfig.DeviceRequests, function (o) {
        return o.Driver === 'nvidia' || (o.Capabilities && o.Capabilities.length > 0 && o.Capabilities[0] > 0 && o.Capabilities[0][0] === 'gpu');
      });
      if (!gpuOptions) {
        return 'No GPU config found';
      }
      let gpuStr = 'all';
      if (gpuOptions.Count !== -1) {
        gpuStr = `"device=${_.join(gpuOptions.DeviceIDs, ',')}"`;
      }
      // we only support a single set of capabilities for now
      // creation UI needs to be reworked in order to support OR combinations of AND capabilities
      const capStr = `"capabilities=${_.join(gpuOptions.Capabilities[0], ',')}"`;
      return `${gpuStr},${capStr}`;
    };

    function update() {
      var nodeName = $transition$.params().nodeName;
      HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);
      $scope.nodeName = nodeName;

      ContainerService.container(endpoint.Id, $transition$.params().id)
        .then(function success(data) {
          var container = data;
          $scope.container = container;
          $scope.container.edit = false;
          $scope.container.newContainerName = $filter('trimcontainername')(container.Name);

          if (container.State.Running) {
            $scope.activityTime = moment.duration(moment(container.State.StartedAt).utc().diff(moment().utc())).humanize();
          } else if (container.State.Status === 'created') {
            $scope.activityTime = moment.duration(moment(container.Created).utc().diff(moment().utc())).humanize();
          } else {
            $scope.activityTime = moment.duration(moment().utc().diff(moment(container.State.FinishedAt).utc())).humanize();
          }

          $scope.portBindings = [];
          if (container.NetworkSettings.Ports) {
            _.forEach(Object.keys(container.NetworkSettings.Ports), function (key) {
              if (container.NetworkSettings.Ports[key]) {
                _.forEach(container.NetworkSettings.Ports[key], (portMapping) => {
                  const mapping = {};
                  mapping.container = key;
                  mapping.host = `${portMapping.HostIp}:${portMapping.HostPort}`;
                  $scope.portBindings.push(mapping);
                });
              }
            });
          }

          $scope.container.Config.Env = _.sortBy($scope.container.Config.Env, _.toLower);

          const inSwarm = $scope.container.Config.Labels['com.docker.swarm.service.id'];
          const autoRemove = $scope.container.HostConfig.AutoRemove;
          const admin = Authentication.isAdmin();
          const {
            allowContainerCapabilitiesForRegularUsers,
            allowHostNamespaceForRegularUsers,
            allowDeviceMappingForRegularUsers,
            allowSysctlSettingForRegularUsers,
            allowSecurityOptForRegularUsers,
            allowBindMountsForRegularUsers,
            allowPrivilegedModeForRegularUsers,
          } = endpoint.SecuritySettings;

          const settingRestrictsRegularUsers =
            !allowContainerCapabilitiesForRegularUsers ||
            !allowBindMountsForRegularUsers ||
            !allowDeviceMappingForRegularUsers ||
            !allowSysctlSettingForRegularUsers ||
            !allowSecurityOptForRegularUsers ||
            !allowHostNamespaceForRegularUsers ||
            !allowPrivilegedModeForRegularUsers;

          // displayCreateWebhookButton should false for podman because recreating podman containers give and error: cannot set memory swappiness with cgroupv2
          // https://github.com/containrrr/watchtower/issues/1060#issuecomment-2319076222
          // can be the same value as useCanRecreateContainer
          const isPodman = endpoint.ContainerEngine === ContainerEngine.Podman;
          $scope.displayCreateWebhookButton = !inSwarm && !autoRemove && (admin || !settingRestrictsRegularUsers) && !isPodman;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve container info');
        });
    }

    $scope.renameContainer = function () {
      var container = $scope.container;
      if (container.newContainerName === $filter('trimcontainername')(container.Name)) {
        $scope.container.edit = false;
        return;
      }
      ContainerService.renameContainer(endpoint.Id, $transition$.params().id, container.newContainerName)
        .then(function success() {
          container.Name = container.newContainerName;
          Notifications.success('Container successfully renamed', container.Name);
        })
        .catch(function error(err) {
          container.newContainerName = $filter('trimcontainername')(container.Name);
          Notifications.error('Failure', err, 'Unable to rename container');
        })
        .finally(function final() {
          $scope.container.edit = false;
          $scope.$apply();
        });
    };

    async function commitContainerAsync() {
      $scope.config.commitInProgress = true;
      const registryModel = $scope.config.RegistryModel;
      const { repo, tag } = ImageHelper.createImageConfigForContainer(registryModel);
      try {
        await commitContainer(endpoint.Id, { container: $transition$.params().id, repo, tag });
        Notifications.success('Image created', $transition$.params().id);
        $state.reload();
      } catch (err) {
        Notifications.error('Failure', err, 'Unable to create image');
        $scope.config.commitInProgress = false;
      }
    }

    $scope.commit = function () {
      return $async(commitContainerAsync);
    };

    update();
  },
]);
