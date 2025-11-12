import { object, string, boolean, SchemaOf, array, number } from 'yup';

import { envVarValidation } from '@@/form-components/EnvironmentVariablesFieldset';

import { StackEditorFormValues } from './StackEditorTab.types';
import { validateYAML } from './stackYamlValidation';

export function getValidationSchema(
  containerNames: string[] = [],
  originalContainerNames: string[] = []
): SchemaOf<StackEditorFormValues> {
  return object({
    stackFileContent: string()
      .required('Stack file content is required')
      .min(1, 'Stack file content cannot be empty')
      .test('valid-yaml', 'Invalid YAML', function validateYamlTest(value) {
        if (!value) {
          return true; // Let required validation handle empty values
        }

        const yamlError = validateYAML(
          value,
          containerNames,
          originalContainerNames
        );

        if (yamlError) {
          return this.createError({ message: yamlError });
        }

        return true;
      }),
    environmentVariables: envVarValidation(),
    prune: boolean().default(false),
    registries: array(number().required()).default([]),
    rollbackTo: string().notRequired(),
    webhookId: string().default(''),
  });
}
