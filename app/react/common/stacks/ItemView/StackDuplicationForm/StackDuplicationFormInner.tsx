import { useState } from 'react';
import { Field, Form, useFormikContext } from 'formik';
import { Copy, ArrowRight } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { Input } from '@@/form-components/Input';
import { FormError } from '@@/form-components/FormError';

import { FormSubmitValues, ActionType } from './StackDuplicationForm.types';
import { useValidation } from './StackDuplicationForm.validation';
import { EnvSelector } from './EnvSelector';

interface Props {
  yamlError?: string;
  currentEnvironmentId: EnvironmentId;
}

export function StackDuplicationFormInner({
  yamlError,
  currentEnvironmentId,
}: Props) {
  const { values, errors, setFieldValue, submitForm, isSubmitting } =
    useFormikContext<FormSubmitValues>();

  const validState = useValidation({
    values,
    currentEnvironmentId,
  });

  const [actionType, setActionType] = useState<ActionType | null>(null);

  const isEnvSelected = !!values.environmentId;

  async function handleAction(type: ActionType) {
    setActionType(type);
    // Set the actionType in form values before submitting
    await setFieldValue('actionType', type);
    await submitForm();
  }

  const isMigrateInProgress = isSubmitting && actionType === 'migrate';
  const isDuplicateInProgress = isSubmitting && actionType === 'duplicate';

  const isMigrateDisabled = isSubmitting || !validState.migrate;
  const isDuplicateDisabled =
    isSubmitting || !validState.duplicate || !!yamlError;

  return (
    <Form>
      <div className="form-group">
        <span className="small mt-2">
          <p className="text-muted">
            This feature allows you to duplicate or migrate this stack.
          </p>
        </span>
      </div>

      <div className="form-group">
        <Field
          as={Input}
          type="text"
          placeholder="Stack name (optional for migration)"
          aria-label="Stack name"
          name="newName"
          data-cy="stack-duplicate-name-input"
        />
        {errors.newName && (
          <div className="col-sm-12">
            <FormError>{errors.newName}</FormError>
          </div>
        )}
      </div>

      <EnvSelector
        onChange={(value) => setFieldValue('environmentId', value)}
        value={values.environmentId}
        error={errors.environmentId}
      />

      <div className="form-group">
        <LoadingButton
          type="button"
          color="primary"
          size="small"
          disabled={isMigrateDisabled}
          isLoading={isMigrateInProgress}
          loadingText="Migration in progress..."
          onClick={() => handleAction('migrate')}
          icon={ArrowRight}
          data-cy="stack-migrate-button"
          className="!ml-0"
        >
          Migrate
        </LoadingButton>

        <LoadingButton
          type="button"
          color="primary"
          size="small"
          disabled={isDuplicateDisabled}
          isLoading={isDuplicateInProgress}
          loadingText="Duplication in progress..."
          onClick={() => handleAction('duplicate')}
          icon={Copy}
          data-cy="stack-duplicate-button"
        >
          Duplicate
        </LoadingButton>
      </div>

      {yamlError && isEnvSelected && (
        <div className="form-group">
          <div>
            <span className="text-danger small">{yamlError}</span>
          </div>
        </div>
      )}
    </Form>
  );
}
