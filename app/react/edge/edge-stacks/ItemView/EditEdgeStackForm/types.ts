import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import {
  DeploymentType,
  StaggerConfig,
} from '@CE/react/edge/edge-stacks/types';

import { EnvVar } from '@@CE/form-components/EnvironmentVariablesFieldset/types';

export interface FormValues {
  edgeGroups: EdgeGroup['Id'][];
  deploymentType: DeploymentType;
  privateRegistryId?: number;
  content: string;
  useManifestNamespaces: boolean;
  prePullImage: boolean;
  retryDeploy: boolean;
  webhookEnabled: boolean;
  envVars: EnvVar[];
  rollbackTo?: number;
  staggerConfig: StaggerConfig;
}
