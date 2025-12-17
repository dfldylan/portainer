import { VariablesFieldValue } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesField';
import { EnvVarsValue } from '@CE/react/portainer/templates/app-templates/DeployFormWidget/EnvVarsFieldset';

export type SelectedTemplateValue =
  | { templateId: number; type: 'custom' }
  | { templateId: number; type: 'app' }
  | { templateId: undefined; type: undefined };

export type Values = {
  variables: VariablesFieldValue;
  envVars: EnvVarsValue;
} & SelectedTemplateValue;
