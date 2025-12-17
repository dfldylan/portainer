import { Form, useFormikContext } from 'formik';

import { Stack, StackType } from '@CE/react/common/stacks/types';
import { baseStackWebhookUrl } from '@CE/portainer/helpers/webhookHelper';
import { useApiVersion } from '@CE/react/docker/proxy/queries/useVersion';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { AutoUpdateFieldset } from '@CE/react/portainer/gitops/AutoUpdateFieldset';
import { InfoPanel } from '@CE/react/portainer/gitops/InfoPanel';
import { TimeWindowDisplay } from '@CE/react/portainer/gitops/TimeWindowDisplay';

import { FormSection } from '@@CE/form-components/FormSection';
import { StackEnvironmentVariablesPanel } from '@@CE/form-components/EnvironmentVariablesFieldset';

import { FormValues } from './types';
import { AdvancedConfigurationSection } from './AdvancedConfigurationSection';
import { OptionsSection } from './OptionsSection';
import { ActionsSection } from './ActionsSection';

export function InnerForm({
  stack,
  onDeploy,
  webhookId,
  isDeployLoading,
  isSaveLoading,
}: {
  stack: Stack;
  webhookId: string;
  onDeploy(values: FormValues): Promise<void>;
  isSaveLoading: boolean;
  isDeployLoading: boolean;
}) {
  const envId = useEnvironmentId();
  const apiVersion = useApiVersion(envId);
  const { values, setFieldValue, errors, dirty, isValid } =
    useFormikContext<FormValues>();

  const gitConfig = stack.GitConfig;

  if (!gitConfig) {
    return null;
  }

  return (
    <Form className="form-horizontal my-8">
      <FormSection title="Redeploy from git repository">
        <InfoPanel
          className="text-muted small"
          url={gitConfig.URL}
          type="stack"
          configFilePath={gitConfig.ConfigFilePath}
          additionalFiles={stack.AdditionalFiles}
        />

        <AutoUpdateFieldset
          value={values.autoUpdate}
          onChange={(value) => setFieldValue('autoUpdate', value)}
          environmentType="DOCKER"
          isForcePullVisible={stack.Type !== StackType.Kubernetes}
          baseWebhookUrl={baseStackWebhookUrl()}
          webhookId={webhookId}
          webhooksDocs="/user/docker/stacks/webhooks"
          errors={errors.autoUpdate}
        />

        <TimeWindowDisplay />

        <AdvancedConfigurationSection stack={stack} />

        <StackEnvironmentVariablesPanel
          values={values.env}
          onChange={(value) => setFieldValue('env', value)}
          showHelpMessage
          isFoldable
          errors={errors.env}
        />

        <OptionsSection stack={stack} apiVersion={apiVersion} />

        <ActionsSection
          isDirty={dirty}
          isValid={isValid}
          isSaveLoading={isSaveLoading}
          isDeployLoading={isDeployLoading}
          onDeploy={() => onDeploy(values)}
        />
      </FormSection>
    </Form>
  );
}
