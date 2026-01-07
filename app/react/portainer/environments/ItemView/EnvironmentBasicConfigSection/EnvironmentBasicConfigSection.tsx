import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';
import { Icon } from '@@/Icon';

interface Values {
  name: string;
  url: string;
  publicUrl: string;
}

interface Props {
  values: Values;
  setValues: (values: Values) => void;
  isEdge: boolean;
  isAzure: boolean;
  isAgent: boolean;
  hasError: boolean;
  isLocalEnvironment: boolean;
}

export function EnvironmentBasicConfigSection({
  values,
  setValues,
  isEdge,
  isAzure,
  isAgent,
  hasError,
  isLocalEnvironment,
}: Props) {
  return (
    <FormSection title="Configuration">
      <FormControl label="Name" inputId="container_name" size="small" required>
        <Input
          id="container_name"
          value={values.name}
          onChange={(e) =>
            setValues({
              ...values,
              name: e.target.value,
            })
          }
          placeholder="e.g. kubernetes-cluster01 / docker-prod01"
          disabled={hasError}
          required
          data-cy="container-name-input"
        />
      </FormControl>

      {!hasError && (
        <>
          {!isEdge && (
            <FormControl
              label={isAgent ? 'Environment address' : 'Environment URL'}
              inputId="endpoint_url"
              size="small"
              tooltip={
                isAgent
                  ? 'The address for the Portainer agent in the format <HOST>:<PORT> or <IP>:<PORT>'
                  : 'URL or IP address of a Docker host. The Docker API must be exposed over a TCP port. Please refer to the Docker documentation to configure it.'
              }
            >
              <Input
                id="endpoint_url"
                value={values.url}
                onChange={(e) =>
                  setValues({
                    ...values,
                    url: e.target.value,
                  })
                }
                placeholder="e.g. 10.0.0.10:2375 or mydocker.mydomain.com:2375"
                disabled={isLocalEnvironment || isAzure}
                data-cy="endpoint-url-input"
              />
            </FormControl>
          )}

          {!isAzure && (
            <>
              <FormControl
                label="Public IP"
                inputId="endpoint_public_url"
                size="small"
                tooltip="URL or IP address where exposed containers will be reachable. This field is optional and will default to the environment URL."
              >
                <Input
                  id="endpoint_public_url"
                  value={values.publicUrl}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      publicUrl: e.target.value,
                    })
                  }
                  placeholder="e.g. 10.0.0.10 or mydocker.mydomain.com"
                  data-cy="public-url-input"
                />
              </FormControl>

              {isEdge && (
                <div className="col-sm-12 small text-muted vertical-center mt-2">
                  <Icon
                    icon="alert-circle"
                    mode="primary"
                    className="space-right"
                  />
                  Use https connection on Edge agent to use private registries
                  with credentials.
                </div>
              )}
            </>
          )}
        </>
      )}
    </FormSection>
  );
}
