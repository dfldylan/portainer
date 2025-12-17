import { truncateLeftRight } from '@CE/portainer/filters/filters';

import { HelpLink } from '@@CE/HelpLink';
import { CopyButton } from '@@CE/buttons';
import { FormControl } from '@@CE/form-components/FormControl';

export function WebhookSettings({
  value,
  baseUrl,
  docsLink,
}: {
  docsLink?: string;
  value: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/${value}`;

  return (
    <FormControl
      label="Webhook"
      tooltip={
        !!docsLink && (
          <>
            See{' '}
            <HelpLink docLink={docsLink}>
              Portainer documentation on webhook usage
            </HelpLink>
            .
          </>
        )
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-muted">{truncateLeftRight(url)}</span>
        <CopyButton
          copyText={url}
          color="light"
          data-cy="copy-webhook-link-button"
        >
          Copy link
        </CopyButton>
      </div>
    </FormControl>
  );
}
