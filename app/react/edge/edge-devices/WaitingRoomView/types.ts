import { Environment } from '@CE/react/portainer/environments/types';

export type WaitingRoomEnvironment = Environment & {
  EdgeGroups: string[];
  Tags: string[];
  Group: string;
};
