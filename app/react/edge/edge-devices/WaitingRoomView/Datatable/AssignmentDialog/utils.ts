import { Environment } from '@CE/react/portainer/environments/types';

export function isAssignedToGroup(environment: Environment) {
  return ![0, 1].includes(environment.GroupId);
}
