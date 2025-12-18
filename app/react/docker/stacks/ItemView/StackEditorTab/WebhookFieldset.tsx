import uuidv4 from 'uuid/v4';
import { useState } from 'react';

import { baseStackWebhookUrl } from '@/portainer/helpers/webhookHelper';
import { Authorized, useAuthorizations } from '@/react/hooks/useUser';
import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { WebhookSettings } from '@/react/portainer/gitops/AutoUpdateFieldset/WebhookSettings';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookFieldset({
  value,
  onChange,
  hasWebhook,
}: {
  value: string;
  onChange(value: string): void;

  hasWebhook?: boolean;
}) {
  const authQuery = useAuthorizations(
    hasWebhook ? ['PortainerWebhookDelete'] : ['PortainerWebhookCreate']
  );

  return (
    <Authorized
      authorizations={[
        'PortainerWebhookCreate',
        'PortainerWebhookList',
        'PortainerWebhookDelete',
      ]}
      adminOnlyCE
    >
      <AuthorizedWebhook
        value={value}
        onChange={onChange}
        disabled={!authQuery.authorized}
      />
    </Authorized>
  );
}

export function AuthorizedWebhook({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange(value: string): void;
  disabled?: boolean;
}) {
  const [cachedWebhookId, setCachedWebhookId] = useState(value);

  return (
    <FormSection title="Webhooks">
      <SwitchField
        name="enableWebhook"
        checked={!!value}
        onChange={(checked) => handleChange(checked)}
        labelClass="col-sm-2"
        tooltip="Create a webhook (or callback URI) to automate the update of this stack. Sending a POST request to this callback URI (without requiring any authentication) will pull the most up-to-date version of the associated image and re-deploy this stack."
        label="Create a Stack webhook"
        featureId={FeatureId.STACK_WEBHOOK}
        data-cy="stack-webhook-switch"
        disabled={disabled}
      />
      {value && (
        <WebhookSettings baseUrl={baseStackWebhookUrl()} value={value} />
      )}
    </FormSection>
  );

  function handleChange(enable: boolean) {
    if (enable) {
      onChange(cachedWebhookId || uuidv4());
    } else {
      setCachedWebhookId(value);
      onChange('');
    }
  }
}
