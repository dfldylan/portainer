import { Registry } from '@CE/react/portainer/registries/types/registry';

export interface Values {
  useRegistry: boolean;
  registryId?: Registry['Id'];
  image: string;
}
