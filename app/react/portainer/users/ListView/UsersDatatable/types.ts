import { type User } from '@CE/portainer/users/types';

export type DecoratedUser = User & {
  isTeamLeader?: boolean;
  authMethod: string;
};
