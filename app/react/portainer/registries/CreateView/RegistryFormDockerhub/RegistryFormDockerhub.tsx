import { Formik, Form, Field } from 'formik';
import { SchemaOf, object, string } from 'yup';

import { useAnalytics } from '@/react/hooks/useAnalytics';

import { LoadingButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

export interface RegistryFormDockerhubValues {
  Name: string;
  Username: string;
  Password: string;
}

interface Props {
  initialValues: RegistryFormDockerhubValues;
  onSubmit: (values: RegistryFormDockerhubValues) => void | Promise<void>;
  submitLabel: string;
  isLoading: boolean;
  nameIsUsed: (name: string) => Promise<boolean>;
}

export function RegistryFormDockerhub({
  initialValues,
  onSubmit,
  submitLabel,
  isLoading,
  nameIsUsed,
}: Props) {
  const { trackEvent } = useAnalytics();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={() => validationSchema(nameIsUsed)}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
    >
      {({ errors, isValid, dirty }) => (
        <Form className="form-horizontal">
          <FormSection title="Important notice">
            <TextTip color="blue">
              <p>
                For information on how to generate a DockerHub Access Token,
                follow the{' '}
                <a
                  href="https://docs.docker.com/docker-hub/access-tokens/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dockerhub guide
                </a>
                .
              </p>
            </TextTip>
          </FormSection>

          <FormSection title="DockerHub account details">
            <FormControl
              label="Name"
              inputId="registry_name"
              errors={errors.Name}
              required
            >
              <Field
                as={Input}
                id="registry_name"
                name="Name"
                placeholder="dockerhub-prod-us"
                data-cy="component-registryName"
              />
            </FormControl>

            <FormControl
              label="DockerHub username"
              inputId="registry_username"
              errors={errors.Username}
              required
            >
              <Field
                as={Input}
                id="registry_username"
                name="Username"
                data-cy="component-registryUsername"
              />
            </FormControl>

            <FormControl
              label="DockerHub access token"
              inputId="registry_password"
              errors={errors.Password}
              required
            >
              <Field
                as={Input}
                id="registry_password"
                name="Password"
                type="password"
              />
            </FormControl>
          </FormSection>

          <FormSection title="Actions">
            <div className="form-group">
              <div className="col-sm-12">
                <LoadingButton
                  type="submit"
                  color="primary"
                  size="small"
                  disabled={!isValid || !dirty}
                  isLoading={isLoading}
                  loadingText="In progress..."
                  onClick={() => handleAnalytics()}
                  data-cy="registry-form-submit"
                >
                  {submitLabel}
                </LoadingButton>
              </div>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );

  function handleSubmit(values: RegistryFormDockerhubValues) {
    return onSubmit(values);
  }

  function handleAnalytics() {
    trackEvent('portainer-registry-creation', {
      category: 'portainer',
      metadata: { type: 'dockerhub' },
    });
  }
}

function validationSchema(
  nameIsUsed: (name: string) => Promise<boolean>
): SchemaOf<RegistryFormDockerhubValues> {
  return object({
    Name: string()
      .required('This field is required.')
      .test(
        'name-not-used',
        'A registry with the same name already exists.',
        async (name) => !(await nameIsUsed(name || ''))
      ),
    Username: string().required('This field is required.'),
    Password: string().required('This field is required.'),
  });
}
