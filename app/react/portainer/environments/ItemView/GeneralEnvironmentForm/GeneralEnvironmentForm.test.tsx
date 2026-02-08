import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultBodyType, http, HttpResponse } from 'msw';
import { describe, it, expect, vi } from 'vitest';

import { withUserProvider } from '@/react/test-utils/withUserProvider';
import { server } from '@/setup-tests/server';
import {
  Environment,
  EnvironmentType,
  EnvironmentStatus,
} from '@/react/portainer/environments/types';
import {
  createMockEnvironment,
  createMockUser,
} from '@/react-tools/test-mocks';
import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { withTestRouter } from '@/react/test-utils/withRouter';

import { GeneralEnvironmentForm } from './GeneralEnvironmentForm';

describe('GeneralEnvironmentForm', () => {
  it('should render all fields for Docker environment', async () => {
    const dockerEnv = createMockEnvironment({
      Type: EnvironmentType.Docker,
      URL: 'unix:///var/run/docker.sock',
    });
    renderComponent(dockerEnv);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    expect(screen.getByLabelText('Environment URL')).toBeVisible();
    expect(screen.getByLabelText('Public IP')).toBeVisible();
    expect(screen.queryByText(/TLS/i)).not.toBeInTheDocument();
  });

  it('should render TLS section for Docker API environment', async () => {
    const dockerApiEnv = createMockEnvironment({
      Type: EnvironmentType.Docker,
      URL: 'tcp://10.0.0.1:2375',
    });
    renderComponent(dockerApiEnv);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    expect(screen.getByLabelText('Environment URL')).toBeVisible();
    expect(screen.getByLabelText('Public IP')).toBeVisible();
    expect(screen.getByText(/TLS/i)).toBeVisible();
  });

  it('should not show TLS section for Kubernetes environment', async () => {
    const k8sEnv = createMockEnvironment({
      Type: EnvironmentType.AgentOnKubernetes,
    });
    renderComponent(k8sEnv);
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    expect(screen.queryByText(/TLS/i)).not.toBeInTheDocument();
  });

  it('should not show URL fields when environment has error', async () => {
    const errorEnv = createMockEnvironment({
      Status: EnvironmentStatus.Error,
    });
    renderComponent(errorEnv);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    expect(screen.queryByLabelText('Environment URL')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Public IP')).not.toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const env = createMockEnvironment();
    renderComponent(env);
    const nameInput = screen.getByRole('textbox', { name: /Name/ });
    await waitFor(() => {
      expect(nameInput).toBeVisible();
    });

    await userEvent.clear(nameInput);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeVisible();
    });
  });

  it('should strip protocol from URL on load', async () => {
    const env = createMockEnvironment({ URL: 'tcp://10.0.0.1:2375' });
    renderComponent(env);

    await waitFor(() => {
      const urlInput = screen.getByLabelText('Environment URL');
      expect(urlInput).toHaveValue('10.0.0.1:2375');
    });
  });

  it('should handle submission', async () => {
    let requestPayload: DefaultBodyType;

    server.use(
      http.put('/api/endpoints/:id', async ({ request }) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        requestPayload = await request.json();
        return HttpResponse.json({});
      })
    );

    const env = createMockEnvironment({ Id: 1, Name: 'test-env' });
    const onSuccess = vi.fn();
    renderComponent(env, { onSuccess });

    const nameInput = screen.getByRole('textbox', { name: /Name/ });

    await waitFor(() => {
      expect(nameInput).toBeVisible();
    });

    // Fill form fields
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'my-environment');

    expect(nameInput).toHaveValue('my-environment');

    const urlInput = screen.getByLabelText('Environment URL');
    await userEvent.clear(urlInput);
    await userEvent.type(urlInput, '10.0.0.1:2375');

    const publicUrlInput = screen.getByLabelText('Public IP');
    await userEvent.type(publicUrlInput, '1.2.3.4');

    // Wait for debounce to complete (NameField uses useDebounce)
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const submitButton = screen.getByRole('button', {
      name: /update environment/i,
    });

    // Wait for Formik to process all changes and enable submit button
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await userEvent.click(submitButton);
    expect(await screen.findByText(/updating environment/i)).toBeVisible();

    // Verify payload
    await waitFor(() => {
      expect(requestPayload).toMatchObject({
        Name: 'my-environment',
        URL: 'tcp://10.0.0.1:2375',
        PublicURL: '1.2.3.4',
      });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should render cancel button', async () => {
    const env = createMockEnvironment();
    renderComponent(env);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    expect(screen.getByText('Cancel')).toBeVisible();
  });

  it('should disable submit button when form is invalid', async () => {
    const env = createMockEnvironment();
    renderComponent(env);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
    });

    // Clear required field to make form invalid
    const nameInput = screen.getByRole('textbox', { name: /Name/ });
    await userEvent.clear(nameInput);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', {
        name: /update environment/i,
      });
      expect(submitButton).toBeDisabled();

      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });
});

function renderComponent(
  environment: Environment,
  { onSuccess = vi.fn() } = {}
) {
  const Wrapped = withUserProvider(
    withTestRouter(withTestQueryProvider(GeneralEnvironmentForm)),
    createMockUser({
      Id: 1,
      Username: 'admin',
      Role: 1,
    })
  );

  return render(<Wrapped environment={environment} onSuccess={onSuccess} />);
}
