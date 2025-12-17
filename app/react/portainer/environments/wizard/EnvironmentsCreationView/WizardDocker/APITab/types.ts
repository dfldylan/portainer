import { TLSConfig } from '@CE/react/components/TLSFieldset/types';
import { EnvironmentMetadata } from '@CE/react/portainer/environments/environment.service/create';

export interface FormValues {
  name: string;
  url: string;
  tlsConfig: TLSConfig;
  meta: EnvironmentMetadata;
}
