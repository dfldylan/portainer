import { UserId } from '@CE/portainer/users/types';

export interface FormValues {
  name: string;
  leaders: UserId[];
}
