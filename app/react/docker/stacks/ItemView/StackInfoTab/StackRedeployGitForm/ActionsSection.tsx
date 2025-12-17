import { RefreshCw } from 'lucide-react';

import { FormSection } from '@@CE/form-components/FormSection';
import { LoadingButton } from '@@CE/buttons';

interface Props {
  isDirty: boolean;
  isValid: boolean;
  isSaveLoading: boolean;
  isDeployLoading: boolean;
  onDeploy: () => void;
}

export function ActionsSection({
  isDirty,
  isValid,
  isSaveLoading,
  isDeployLoading,
  onDeploy,
}: Props) {
  return (
    <FormSection title="Actions">
      <LoadingButton
        size="small"
        color="primary"
        type="button"
        onClick={onDeploy}
        disabled={isDirty || isSaveLoading}
        isLoading={isDeployLoading}
        loadingText="In progress..."
        data-cy="stack-redeploy-button"
      >
        <RefreshCw className="mr-1" />
        Pull and redeploy
      </LoadingButton>

      <LoadingButton
        size="small"
        color="primary"
        disabled={!isDirty || !isValid || isDeployLoading}
        isLoading={isSaveLoading}
        loadingText="In progress..."
        className="ml-2"
        data-cy="stack-save-settings-button"
      >
        Save settings
      </LoadingButton>
    </FormSection>
  );
}
