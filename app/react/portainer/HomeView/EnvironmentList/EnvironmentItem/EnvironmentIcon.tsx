import { getEnvironmentTypeIcon } from '@CE/react/portainer/environments/utils';
import dockerEdge from '@CE/assets/ico/docker-edge-environment.svg';
import podmanEdge from '@CE/assets/ico/podman-edge-environment.svg';
import kube from '@CE/assets/images/kubernetes_endpoint.png';
import kubeEdge from '@CE/assets/ico/kubernetes-edge-environment.svg';
import {
  ContainerEngine,
  EnvironmentType,
} from '@CE/react/portainer/environments/types';
import azure from '@CE/assets/ico/vendor/azure.svg';
import docker from '@CE/assets/ico/vendor/docker.svg';
import podman from '@CE/assets/ico/vendor/podman.svg';

import { Icon } from '@@CE/Icon';

interface Props {
  type: EnvironmentType;
  containerEngine?: ContainerEngine;
}

export function EnvironmentIcon({ type, containerEngine }: Props) {
  switch (type) {
    case EnvironmentType.AgentOnDocker:
    case EnvironmentType.Docker:
      if (containerEngine === ContainerEngine.Podman) {
        return (
          <img
            src={podman}
            width="60"
            alt="podman environment"
            aria-hidden="true"
          />
        );
      }
      return (
        <img
          src={docker}
          width="60"
          alt="docker environment"
          aria-hidden="true"
        />
      );
    case EnvironmentType.Azure:
      return (
        <img
          src={azure}
          width="60"
          alt="azure environment"
          aria-hidden="true"
        />
      );
    case EnvironmentType.EdgeAgentOnDocker:
      if (containerEngine === ContainerEngine.Podman) {
        return (
          <img
            src={podmanEdge}
            alt="podman edge environment"
            aria-hidden="true"
          />
        );
      }
      return (
        <img
          src={dockerEdge}
          alt="docker edge environment"
          aria-hidden="true"
        />
      );
    case EnvironmentType.KubernetesLocal:
    case EnvironmentType.AgentOnKubernetes:
      return <img src={kube} alt="kubernetes environment" aria-hidden="true" />;
    case EnvironmentType.EdgeAgentOnKubernetes:
      return (
        <img
          src={kubeEdge}
          alt="kubernetes edge environment"
          aria-hidden="true"
        />
      );
    default:
      return (
        <Icon
          icon={getEnvironmentTypeIcon(type, containerEngine)}
          className="blue-icon !h-16 !w-16"
        />
      );
  }
}
