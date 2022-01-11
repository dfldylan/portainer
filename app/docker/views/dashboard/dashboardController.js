import angular from 'angular';
import _ from 'lodash';

angular.module('portainer.docker').controller('DashboardController', [
  '$scope',
  '$q',
  'Authentication',
  'ContainerService',
  'ImageService',
  'NetworkService',
  'VolumeService',
  'SystemService',
  'ServiceService',
  'StackService',
  'EndpointService',
  'Notifications',
  'EndpointProvider',
  'StateManager',
  'TagService',
  'endpoint',
  function (
    $scope,
    $q,
    Authentication,
    ContainerService,
    ImageService,
    NetworkService,
    VolumeService,
    SystemService,
    ServiceService,
    StackService,
    EndpointService,
    Notifications,
    EndpointProvider,
    StateManager,
    TagService,
    endpoint
  ) {
    $scope.dismissInformationPanel = function (id) {
      StateManager.dismissInformationPanel(id);
    };

    $scope.offlineMode = false;
    $scope.showStacks = false;

    async function initView() {
      const endpointMode = $scope.applicationState.endpoint.mode;
      const endpointId = EndpointProvider.endpointID();
      $scope.endpointId = endpointId;

      $scope.showStacks = await shouldShowStacks();

      $q.all({
        containers: ContainerService.containers(1),
        images: ImageService.images(false),
        volumes: VolumeService.volumes(),
        networks: NetworkService.networks(true, true, true),
        services: endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER' ? ServiceService.services() : [],
        stacks: StackService.stacks(true, endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER', endpointId),
        info: SystemService.info(),
        endpoint: EndpointService.endpoint(endpointId),
        tags: TagService.tags(),
      })
        .then(function success(data) {
          $scope.containers = data.containers;
          $scope.useAllGpus = false;
          $scope.gpuUseSet = new Set();
          $scope.gpuOccupied = 0;
          for (let item of $scope.containers) {
            if (item.State != "running") continue;
            ContainerService.container(item.Id).then(function success(data) {
              if ($scope.useAllGpus === false) {
                const gpuOptions = _.find(data.HostConfig.DeviceRequests, function(o) { return (o.Driver === 'nvidia' || o.Capabilities[0][0] === 'gpu') });
                if (gpuOptions) {
                  if (gpuOptions.Count === -1) {
                    $scope.useAllGpus = true;
                  }
                  else {
                    for (let id of gpuOptions.DeviceIDs) {
                      $scope.gpuUseSet.add(id);
                    }
                  }
                  $scope.gpuOccupied = $scope.useAllGpus ? $scope.endpoint.Gpus.length : $scope.gpuUseSet.size;
                }
              };
            });
          }
          $scope.images = data.images;
          $scope.volumeCount = data.volumes.length;
          $scope.networkCount = data.networks.length;
          $scope.serviceCount = data.services.length;
          $scope.stackCount = data.stacks.length;
          $scope.info = data.info;
          $scope.endpoint = data.endpoint;
          var gpusInfo = new Array();
          for (let i = 0; i < $scope.endpoint.Gpus.length; i++) {
            var exist = false;
            for (let gpuInfo in gpusInfo) {
              if ($scope.endpoint.Gpus[i].value === gpuInfo) {
                gpusInfo[gpuInfo] += 1;
                exist = true;
              }
            }
            if (exist === false) {
              gpusInfo[$scope.endpoint.Gpus[i].value] = 1;
            }
          }
          $scope.gpusInfo = Object.keys(gpusInfo).length
            ? _.join(
              _.map(Object.keys(gpusInfo), (gpuInfo) => {
                var _str = gpusInfo[gpuInfo];
                _str += ' x ';
                _str += gpuInfo;
                return _str;
              })
              , ' + '
            )
            : 'none';

          $scope.endpointTags = $scope.endpoint.TagIds.length
            ? _.join(
              _.filter(
                _.map($scope.endpoint.TagIds, (id) => {
                  const tag = data.tags.find((tag) => tag.Id === id);
                  return tag ? tag.Name : '';
                }),
                Boolean
              ),
              ', '
            )
            : '-';
          $scope.offlineMode = EndpointProvider.offlineMode();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to load dashboard data');
        });
    }

    async function shouldShowStacks() {
      const isAdmin = Authentication.isAdmin();

      return isAdmin || endpoint.SecuritySettings.allowStackManagementForRegularUsers;
    }

    initView();
  },
]);
