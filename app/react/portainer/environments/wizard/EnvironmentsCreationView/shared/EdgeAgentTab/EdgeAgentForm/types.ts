import { EdgeAsyncIntervalsValues } from '@CE/react/edge/components/EdgeAsyncIntervalsForm';
import { EnvironmentMetadata } from '@CE/react/portainer/environments/environment.service/create';

export interface FormValues {
  name: string;

  portainerUrl: string;
  tunnelServerAddr?: string;
  pollFrequency: number;
  meta: EnvironmentMetadata;

  edge: EdgeAsyncIntervalsValues;
}
