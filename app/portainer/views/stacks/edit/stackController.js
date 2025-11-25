import { ResourceControlType } from '@/react/portainer/access-control/types';
import { AccessControlFormData } from 'Portainer/components/accessControlForm/porAccessControlFormModel';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { StackStatus, StackType } from '@/react/common/stacks/types';
import { extractContainerNames } from '@/react/docker/stacks/ItemView/container-names';

angular.module('portainer.app').controller('StackController', [
  '$async',
  '$q',
  '$scope',
  '$state',
  '$window',
  '$transition$',
  'StackService',
  'NodeService',
  'ServiceService',
  'TaskService',
  'ContainerService',
  'ServiceHelper',
  'TaskHelper',
  'Notifications',
  'FormHelper',
  'StackHelper',
  'Authentication',
  'ContainerHelper',
  'endpoint',
  function (
    $async,
    $q,
    $scope,
    $state,
    $window,
    $transition$,
    StackService,
    NodeService,
    ServiceService,
    TaskService,
    ContainerService,
    ServiceHelper,
    TaskHelper,
    Notifications,
    FormHelper,
    StackHelper,
    Authentication,
    ContainerHelper,
    endpoint
  ) {
    $scope.STACK_TYPES = StackType;

    $scope.resourceType = ResourceControlType.Stack;

    $scope.onUpdateResourceControlSuccess = function () {
      $state.reload();
    };

    $scope.endpoint = endpoint;
    $scope.stackWebhookFeature = FeatureId.STACK_WEBHOOK;
    $scope.stackPullImageFeature = FeatureId.STACK_PULL_IMAGE;
    $scope.state = {
      actionInProgress: false,
      migrationInProgress: false,
      showEditorTab: false,
      yamlError: false,
    };

    $scope.formValues = {
      AccessControlData: new AccessControlFormData(),
    };

    $scope.showEditor = function () {
      $scope.state.showEditorTab = true;
    };

    $scope.onEditorSubmit = function () {
      $scope.state.actionInProgress = true;
    };

    $scope.onEditorSubmitSettled = function () {
      $scope.state.actionInProgress = false;
    };

    function loadStack(id) {
      return $async(async () => {
        var agentProxy = $scope.applicationState.endpoint.mode.agentProxy;

        $q.all({
          stack: StackService.stack(id),
          containers: ContainerService.containers(endpoint.Id, true),
        })
          .then(function success(data) {
            var stack = data.stack;
            $scope.stack = stack;
            $scope.containerNames = ContainerHelper.getContainerNames(data.containers);

            $scope.formValues.Env = $scope.stack.Env;
            $scope.formValues.Prune = !!($scope.stack.Option && $scope.stack.Option.Prune);
            let resourcesPromise = Promise.resolve({});
            if (!stack.Status || stack.Status === 1) {
              resourcesPromise = stack.Type === 1 ? retrieveSwarmStackResources(stack.Name, agentProxy) : retrieveComposeStackResources(stack.Name);
            }

            // Workaround for EE-6118
            if (!stack.EndpointId) {
              stack.EndpointId = endpoint.Id;
            }

            return $q.all({
              stackFile: StackService.getStackFile(id),
              resources: resourcesPromise,
            });
          })
          .then(function success(data) {
            const isSwarm = $scope.stack.Type === StackType.DockerSwarm;
            $scope.stackFileContent = data.stackFile;
            // workaround for missing status, if stack has resources, set the status to 1 (active), otherwise to 2 (inactive) (https://github.com/portainer/portainer/issues/4422)
            if (!$scope.stack.Status) {
              $scope.stack.Status = data.resources && ((isSwarm && data.resources.services.length) || data.resources.containers.length) ? 1 : 2;
            }

            if (isSwarm && $scope.stack.Status === StackStatus.Active) {
              assignSwarmStackResources(data.resources, agentProxy);
            }
            $scope.state.originalContainerNames = extractContainerNames(data.stackFile);

            $scope.state.yamlError = StackHelper.validateYAML(data.stackFile, $scope.containerNames, $scope.state.originalContainerNames);

            $scope.editorTabInitialValues = {
              stackFileContent: data.stackFile,
              environmentVariables: $scope.stack.Env,
              enableWebhook: !!$scope.stack.Webhook,
              webhookId: $scope.stack.Webhook,
              prune: !!($scope.stack.Option && $scope.stack.Option.Prune),
            };
          })
          .catch(function error(err) {
            Notifications.error('Failure', err, 'Unable to retrieve stack details');
          });
      });
    }

    function retrieveSwarmStackResources(stackName, agentProxy) {
      var stackFilter = {
        label: ['com.docker.stack.namespace=' + stackName],
      };

      return $q.all({
        services: ServiceService.services(stackFilter),
        tasks: TaskService.tasks(stackFilter),
        containers: agentProxy ? ContainerService.containers(endpoint.Id, 1) : [],
        nodes: NodeService.nodes(),
      });
    }

    function assignSwarmStackResources(resources, agentProxy) {
      var services = resources.services;
      var tasks = resources.tasks;

      if (agentProxy) {
        var containers = resources.containers;
        for (var j = 0; j < tasks.length; j++) {
          var task = tasks[j];
          TaskHelper.associateContainerToTask(task, containers);
        }
      }

      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        ServiceHelper.associateTasksToService(service, tasks);
      }

      $scope.nodes = resources.nodes;
      $scope.tasks = tasks;
      $scope.services = services;
    }

    function retrieveComposeStackResources(stackName) {
      var stackFilter = {
        label: ['com.docker.compose.project=' + stackName],
      };

      return $q.all({
        containers: ContainerService.containers(endpoint.Id, 1, stackFilter),
      });
    }

    function loadExternalStack(name) {
      const stackType = $scope.stackType;
      if (!stackType || (stackType !== StackType.DockerSwarm && stackType !== StackType.DockerCompose)) {
        Notifications.error('Failure', null, 'Invalid type URL parameter.');
        return;
      }

      if (stackType === StackType.DockerSwarm) {
        loadExternalSwarmStack(name);
      }
    }

    function loadExternalSwarmStack(name) {
      var agentProxy = $scope.applicationState.endpoint.mode.agentProxy;

      retrieveSwarmStackResources(name, agentProxy)
        .then(function success(data) {
          assignSwarmStackResources(data, agentProxy);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve stack details');
        });
    }

    async function canManageStacks() {
      return endpoint.SecuritySettings.allowStackManagementForRegularUsers || Authentication.isAdmin();
    }

    async function initView() {
      // if the user is not an admin, and stack management is disabled for non admins, then take the user to the dashboard
      $scope.createEnabled = await canManageStacks();
      if (!$scope.createEnabled) {
        $state.go('docker.dashboard');
      }

      var stackName = $transition$.params().name;
      $scope.stackName = stackName;

      const regular = $transition$.params().regular == 'true';
      $scope.regular = regular;

      var external = $transition$.params().external == 'true';
      $scope.external = external;

      const orphaned = $transition$.params().orphaned == 'true';
      $scope.orphaned = orphaned;

      const orphanedRunning = $transition$.params().orphanedRunning == 'true';
      $scope.orphanedRunning = orphanedRunning;

      $scope.stackType = parseInt($transition$.params().type, 10);

      if (external || (orphaned && orphanedRunning)) {
        loadExternalStack(stackName);
      }

      if (regular || orphaned) {
        const stackId = $transition$.params().id;
        loadStack(stackId);
      }

      $scope.composeSyntaxMaxVersion = endpoint.ComposeSyntaxMaxVersion;
    }

    initView();
  },
]);
