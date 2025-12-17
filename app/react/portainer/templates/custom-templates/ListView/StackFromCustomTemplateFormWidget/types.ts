import { AccessControlFormData } from '@CE/react/portainer/access-control/types';
import { VariablesFieldValue } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesField';

export interface FormValues {
  name: string;
  variables: VariablesFieldValue;
  accessControl: AccessControlFormData;
  fileContent: string;
}
