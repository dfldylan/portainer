import _ from 'lodash-es';
import { TemplateType } from '@/react/portainer/templates/app-templates/types';
import { TEMPLATE_NAME_VALIDATION_REGEX } from '@/react/portainer/custom-templates/components/CommonFields';
import { AccessControlFormData } from '../../components/accessControlForm/porAccessControlFormModel';

angular.module('portainer.app').controller('TemplatesController', [
  '$scope',
  '$q',
  '$state',
  '$anchorScroll',
  'ContainerService',
  'ImageService',
  'NetworkService',
  'TemplateService',
  'TemplateHelper',
  'VolumeService',
  'Notifications',
  'ResourceControlService',
  'Authentication',
  'FormValidator',
  'StackService',
  'endpoint',
  '$async',
  function (
    $scope,
    $q,
    $state,
    $anchorScroll,
    ContainerService,
    ImageService,
    NetworkService,
    TemplateService,
    TemplateHelper,
    VolumeService,
    Notifications,
    ResourceControlService,
    Authentication,
    FormValidator,
    StackService,
    endpoint,
    $async
  ) {
    const DOCKER_STANDALONE = 'DOCKER_STANDALONE';
    const DOCKER_SWARM_MODE = 'DOCKER_SWARM_MODE';

    $scope.state = {
      selectedTemplate: null,
      showAdvancedOptions: false,
      formValidationError: '',
      actionInProgress: false,
      templateNameRegex: TEMPLATE_NAME_VALIDATION_REGEX,
    };

    $scope.enabledTypes = [TemplateType.Container, TemplateType.ComposeStack];

    $scope.formValues = {
      network: '',
      name: '',
      AccessControlData: new AccessControlFormData(),
    };

    $scope.addVolume = function () {
      $scope.state.selectedTemplate.Volumes.push({ containerPath: '', bind: '', readonly: false, type: 'auto' });
    };

    $scope.removeVolume = function (index) {
      $scope.state.selectedTemplate.Volumes.splice(index, 1);
    };

    $scope.addPortBinding = function () {
      $scope.state.selectedTemplate.Ports.push({ hostPort: '', containerPort: '', protocol: 'tcp' });
    };

    $scope.removePortBinding = function (index) {
      $scope.state.selectedTemplate.Ports.splice(index, 1);
    };

    $scope.addExtraHost = function () {
      $scope.state.selectedTemplate.Hosts.push('');
    };

    $scope.removeExtraHost = function (index) {
      $scope.state.selectedTemplate.Hosts.splice(index, 1);
    };

    $scope.addLabel = function () {
      $scope.state.selectedTemplate.Labels.push({ name: '', value: '' });
    };

    $scope.removeLabel = function (index) {
      $scope.state.selectedTemplate.Labels.splice(index, 1);
    };

    function validateForm(accessControlData, isAdmin) {
      $scope.state.formValidationError = '';
      var error = '';
      error = FormValidator.validateAccessControl(accessControlData, isAdmin);

      if (error) {
        $scope.state.formValidationError = error;
        return false;
      }
      return true;
    }

    function createContainerFromTemplate(template, userId, accessControlData) {
      var templateConfiguration = createTemplateConfiguration(template);
      var generatedVolumeCount = TemplateHelper.determineRequiredGeneratedVolumeCount(template.Volumes);
      var generatedVolumeIds = [];
      VolumeService.createXAutoGeneratedLocalVolumes(generatedVolumeCount)
        .then(function success(data) {
          angular.forEach(data, function (volume) {
            var volumeId = volume.Id;
            generatedVolumeIds.push(volumeId);
          });
          TemplateService.updateContainerConfigurationWithVolumes(templateConfiguration, template, data);
          return ImageService.pullImage(template.RegistryModel);
        })
        .then(function success() {
          return ContainerService.createAndStartContainer(endpoint, templateConfiguration, accessControlData);
        })
        .then(function success(data) {
          const resourceControl = data.Portainer.ResourceControl;
          return ResourceControlService.applyResourceControl(userId, accessControlData, resourceControl, generatedVolumeIds);
        })
        .then(function success() {
          Notifications.success('Success', 'Container successfully created');
          $state.go('docker.containers', {}, { reload: true });
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, err.msg);
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    }

    function createComposeStackFromTemplate(template, userId, accessControlData) {
      var stackName = $scope.formValues.name;

      for (var i = 0; i < template.Env.length; i++) {
        var envvar = template.Env[i];
        if (envvar.preset) {
          envvar.value = envvar.default;
        }
      }

      var repositoryOptions = {
        RepositoryURL: template.Repository.url,
        ComposeFilePathInRepository: template.Repository.stackfile,
        FromAppTemplate: true,
      };

      const endpointId = +$state.params.endpointId;
      StackService.createComposeStackFromGitRepository(stackName, repositoryOptions, template.Env, endpointId)
        .then(function success(data) {
          const resourceControl = data.ResourceControl;
          return ResourceControlService.applyResourceControl(userId, accessControlData, resourceControl);
        })
        .then(function success() {
          Notifications.success('Success', 'Stack successfully deployed');
          $state.go('docker.stacks');
        })
        .catch(function error(err) {
          Notifications.error('Deployment error', err);
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    }

    function createStackFromTemplate(template, userId, accessControlData) {
      var stackName = $scope.formValues.name;
      var env = _.filter(
        _.map(template.Env, function transformEnvVar(envvar) {
          return {
            name: envvar.name,
            value: envvar.preset || !envvar.value ? envvar.default : envvar.value,
          };
        }),
        function removeUndefinedVars(envvar) {
          return envvar.value && envvar.name;
        }
      );

      var repositoryOptions = {
        RepositoryURL: template.Repository.url,
        ComposeFilePathInRepository: template.Repository.stackfile,
        FromAppTemplate: true,
      };

      const endpointId = +$state.params.endpointId;

      StackService.createSwarmStackFromGitRepository(stackName, repositoryOptions, env, endpointId)
        .then(function success(data) {
          const resourceControl = data.ResourceControl;
          return ResourceControlService.applyResourceControl(userId, accessControlData, resourceControl);
        })
        .then(function success() {
          Notifications.success('Success', 'Stack successfully deployed');
          $state.go('docker.stacks');
        })
        .catch(function error(err) {
          Notifications.error('Deployment error', err);
        })
        .finally(function final() {
          $scope.state.actionInProgress = false;
        });
    }

    $scope.createTemplate = function () {
      var userDetails = Authentication.getUserDetails();
      var userId = userDetails.ID;
      var accessControlData = $scope.formValues.AccessControlData;

      if (!validateForm(accessControlData, $scope.isAdmin)) {
        return;
      }

      var template = $scope.state.selectedTemplate;

      $scope.state.actionInProgress = true;
      if (template.Type === 2) {
        createStackFromTemplate(template, userId, accessControlData);
      } else if (template.Type === 3) {
        createComposeStackFromTemplate(template, userId, accessControlData);
      } else {
        createContainerFromTemplate(template, userId, accessControlData);
      }
    };

    $scope.unselectTemplate = function () {
      return $async(async () => {
        $scope.state.selectedTemplate = null;
      });
    };

    $scope.selectTemplate = function (template) {
      return $async(async () => {
        if ($scope.state.selectedTemplate) {
          await $scope.unselectTemplate($scope.state.selectedTemplate);
        }

        if (template.Network) {
          $scope.formValues.network = _.find($scope.availableNetworks, function (o) {
            return o.Name === template.Network;
          });
        } else {
          $scope.formValues.network = _.find($scope.availableNetworks, function (o) {
            return o.Name === 'bridge';
          });
        }

        $scope.formValues.name = template.Name ? template.Name : '';
        $scope.state.selectedTemplate = template;
        $scope.state.deployable = isDeployable($scope.applicationState.endpoint, template.Type);
        $anchorScroll('view-top');
      });
    };

    function isDeployable(endpoint, templateType) {
      let deployable = false;
      switch (templateType) {
        case 1:
          deployable = endpoint.mode.provider === DOCKER_SWARM_MODE || endpoint.mode.provider === DOCKER_STANDALONE;
          break;
        case 2:
          deployable = endpoint.mode.provider === DOCKER_SWARM_MODE;
          break;
        case 3:
          deployable = endpoint.mode.provider === DOCKER_SWARM_MODE || endpoint.mode.provider === DOCKER_STANDALONE;
          break;
      }
      return deployable;
    }

    function createTemplateConfiguration(template) {
      var network = $scope.formValues.network;
      var name = $scope.formValues.name;
      return TemplateService.createTemplateConfiguration(template, name, network);
    }

    function initView() {
      $scope.isAdmin = Authentication.isAdmin();

      var endpointMode = $scope.applicationState.endpoint.mode;
      var apiVersion = $scope.applicationState.endpoint.apiVersion;
      const endpointId = +$state.params.endpointId;

      const showSwarmStacks = endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER' && apiVersion >= 1.25;

      $scope.disabledTypes = !showSwarmStacks ? [TemplateType.SwarmStack] : [];

      $q.all({
        templates: TemplateService.templates(endpointId),
        volumes: VolumeService.getVolumes(),
        networks: NetworkService.networks(
          endpointMode.provider === 'DOCKER_STANDALONE' || endpointMode.provider === 'DOCKER_SWARM_MODE',
          false,
          endpointMode.provider === 'DOCKER_SWARM_MODE' && apiVersion >= 1.25
        ),
      })
        .then(function success(data) {
          var templates = data.templates;
          $scope.templates = templates;
          $scope.availableVolumes = _.orderBy(data.volumes.Volumes, [(volume) => volume.Name.toLowerCase()], ['asc']);
          var networks = data.networks;
          $scope.availableNetworks = networks;
          $scope.allowBindMounts = endpoint.SecuritySettings.allowBindMountsForRegularUsers;
        })
        .catch(function error(err) {
          $scope.templates = [];
          Notifications.error('Failure', err, 'An error occurred during apps initialization.');
        });
    }

    initView();
  },
]);
