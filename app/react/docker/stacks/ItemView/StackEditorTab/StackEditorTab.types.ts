import { Registry } from '@/react/portainer/registries/types/registry';

import { EnvVarValues } from '@@/form-components/EnvironmentVariablesFieldset';

export interface StackEditorFormValues {
  stackFileContent: string;
  environmentVariables: EnvVarValues;
  webhookId: string;
  rollbackTo?: string;
  prune: boolean;
  registries: Array<Registry['Id']>;
}
