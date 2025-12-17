import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { TemplateType } from '@CE/react/portainer/templates/app-templates/types';
import { useIsSwarm } from '@CE/react/docker/proxy/queries/useInfo';

export function useIsDeployable(type: TemplateType) {
  const environmentId = useEnvironmentId();

  const isSwarm = useIsSwarm(environmentId);

  switch (type) {
    case TemplateType.ComposeStack:
    case TemplateType.Container:
      return true;
    case TemplateType.SwarmStack:
      return isSwarm;
    default:
      return false;
  }
}
