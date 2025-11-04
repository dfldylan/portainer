import { object, string, number } from 'yup';
import { useEffect, useState } from 'react';

import { STACK_NAME_VALIDATION_REGEX } from '@/react/constants';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { validateForm } from '@@/form-components/validate-form';

import { FormSubmitValues } from './StackDuplicationForm.types';

/**
 * since this form has two actions, we need to manage separate validation state. Ideally we would use separate forms
 */
export function useValidation({
  values,
  currentEnvironmentId,
}: {
  values: FormSubmitValues;
  currentEnvironmentId: EnvironmentId;
}) {
  const [validState, setValidState] = useState({
    migrate: false,
    duplicate: false,
  });

  useEffect(() => {
    async function validateSchemas() {
      const migrateSchema = getMigrateValidationSchema(currentEnvironmentId);

      const migrateErrors = await validateForm(() => migrateSchema, {
        environmentId: values.environmentId || undefined,
        name: values.newName,
      });

      setValidState((state) => ({ ...state, migrate: !migrateErrors }));
    }

    validateSchemas();
  }, [values.environmentId, values.newName, currentEnvironmentId]);

  useEffect(() => {
    async function validateSchema() {
      const duplicateSchema = getDuplicateValidationSchema();
      const duplicateErrors = await validateForm(() => duplicateSchema, {
        environmentId: values.environmentId || undefined,
        name: values.newName,
      });

      setValidState((state) => ({ ...state, duplicate: !duplicateErrors }));
    }
    validateSchema();
  }, [values.environmentId, values.newName, currentEnvironmentId]);

  return validState;
}

const regexp = new RegExp(STACK_NAME_VALIDATION_REGEX);

const baseNameValidation = string().test(
  'valid-format-if-provided',
  "Stack name must consist of lower case alphanumeric characters, '_' or '-'",
  (value) => !value || regexp.test(value)
);

const baseEnvValidation = number().required(
  'Target environment must be selected'
);

export function getBaseValidationSchema() {
  return object({
    name: baseNameValidation,
    environmentId: baseEnvValidation,
  });
}

export function getDuplicateValidationSchema() {
  return object({
    name: baseNameValidation.required('Stack name is required'),
    environmentId: baseEnvValidation,
  });
}

export function getMigrateValidationSchema(
  currentEnvironmentId: EnvironmentId | undefined
) {
  return object({
    name: baseNameValidation,
    environmentId: baseEnvValidation.test(
      'not-same-as-current',
      'Target environment must be different from the current environment',
      (value) => value !== currentEnvironmentId
    ),
  });
}
