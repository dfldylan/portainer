import { useFormikContext } from 'formik';

import { GitForm } from '@/react/portainer/gitops/GitForm';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { FormValues } from '../types';

import { StackRelativePathFieldset } from './StackRelativePathFieldset';

interface Props {
  baseWebhookUrl?: string;
  isDockerStandalone?: boolean;
}

export function GitSection({
  baseWebhookUrl = '',
  isDockerStandalone = false,
}: Props) {
  const { values, errors, setValues } = useFormikContext<FormValues>();

  return (
    <>
      <GitForm
        value={values.git}
        onChange={(gitValues) =>
          setValues((values) => ({
            ...values,
            git: {
              ...values.git,
              ...gitValues,
            },
          }))
        }
        environmentType="DOCKER"
        deployMethod="compose"
        isDockerStandalone={isDockerStandalone}
        isAdditionalFilesFieldVisible
        isAuthExplanationVisible
        isForcePullVisible
        errors={errors.git}
        baseWebhookUrl={baseWebhookUrl}
        webhookId={values.webhookId}
      />
      {isBE && (
        <StackRelativePathFieldset isDockerStandalone={isDockerStandalone} />
      )}
    </>
  );
}
