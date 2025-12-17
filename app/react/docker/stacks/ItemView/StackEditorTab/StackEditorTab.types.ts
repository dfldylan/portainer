import { EnvVarValues } from '@@CE/form-components/EnvironmentVariablesFieldset';

export interface StackEditorFormValues {
  stackFileContent: string;
  environmentVariables: EnvVarValues;
  webhookId: string | undefined;
  rollbackTo?: number;
  prune: boolean;
}
