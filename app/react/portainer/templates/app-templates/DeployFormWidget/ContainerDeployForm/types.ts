import { AccessControlFormData } from '@CE/react/portainer/access-control/types';
import { PortMapping } from '@CE/react/docker/containers/CreateView/BaseForm/PortsMappingField';
import { VolumesTabValues } from '@CE/react/docker/containers/CreateView/VolumesTab';
import { LabelsTabValues } from '@CE/react/docker/containers/CreateView/LabelsTab';

import { EnvVarsValue } from '../EnvVarsFieldset';

export interface FormValues {
  name: string;
  network: string;
  accessControl: AccessControlFormData;
  ports: Array<PortMapping>;
  volumes: VolumesTabValues;
  hosts: Array<string>;
  labels: LabelsTabValues;
  hostname: string;
  envVars: EnvVarsValue;
}
