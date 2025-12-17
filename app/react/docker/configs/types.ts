import { ResourceControlViewModel } from '@CE/react/portainer/access-control/models/ResourceControlViewModel';

export type DockerConfig = {
  Id: string;
  Name: string;
  CreatedAt: string;
  ResourceControl?: ResourceControlViewModel;
};
