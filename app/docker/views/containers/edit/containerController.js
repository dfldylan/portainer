import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { ResourceControlType } from '@/react/portainer/access-control/types';

angular.module('portainer.docker').controller('ContainerController', ContainerController);

/* @ngInject */
function ContainerController($q, $scope, $state, $transition$, $filter, $async, ContainerService, ImageHelper, Notifications, HttpRequestHelper, Authentication, endpoint) {
  $scope.resourceType = ResourceControlType.Container;
  $scope.endpoint = endpoint;
  $scope.activityTime = 0;
  $scope.portBindings = [];

  $scope.onSuccessAction = update;

  $scope.config = {
    RegistryModel: new PorImageRegistryModel(),
  };

  $scope.onUpdateResourceControlSuccess = function () {
    $state.reload();
  };

  function update() {
    var nodeName = $transition$.params().nodeName;
    HttpRequestHelper.setPortainerAgentTargetHeader(nodeName);
    $scope.nodeName = nodeName;

    ContainerService.container(endpoint.Id, $transition$.params().id)
      .then(function success(data) {
        var container = data;
        $scope.container = container;
      })
      .catch(function error(err) {
        Notifications.error('Failure', err, 'Unable to retrieve container info');
      });
  }

  // TODO - need to fix this
  $scope.getRegistryId = function () {
    return _.get($scope.config.RegistryModel, 'Registry.Id', 0);
  };

  update();
}
