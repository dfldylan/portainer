import {
  GitAuthModel,
  AutoUpdateModel,
} from '@CE/react/portainer/gitops/types';

import { EnvVarValues } from '@@CE/form-components/EnvironmentVariablesFieldset';

export interface FormValues {
  refName: string;
  env: EnvVarValues;
  prune: boolean;

  tlsSkipVerify: boolean;

  auth: GitAuthModel;
  autoUpdate: AutoUpdateModel;
}
