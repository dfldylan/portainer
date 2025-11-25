import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { withTestRouter } from '@/react/test-utils/withRouter';
import { useUpdateGitStack } from '@/react/portainer/gitops/queries/useUpdateGitStack';
import { useUpdateGitStackSettings } from '@/react/portainer/gitops/queries/useUpdateGitStackSettings';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';
import { confirmEnableTLSVerify } from '@/react/portainer/gitops/utils';
import {
  baseStackWebhookUrl,
  createWebhookId,
} from '@/portainer/helpers/webhookHelper';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';

import { StackRedeployGitForm } from './StackRedeployGitForm';

// Extract the props type from the component
type StackRedeployGitFormProps = React.ComponentProps<
  typeof StackRedeployGitForm
>;

vi.mock('@uirouter/react', async (importOriginal: () => Promise<object>) => ({
  ...(await importOriginal()),

  useRouter: vi.fn(() => ({
    stateService: {
      reload: vi.fn(),
    },
  })),
}));

vi.mock('@/react/portainer/gitops/queries/useUpdateGitStack', () => ({
  useUpdateGitStack: vi.fn(),
}));

vi.mock('@/react/portainer/gitops/queries/useUpdateGitStackSettings', () => ({
  useUpdateGitStackSettings: vi.fn(),
}));

vi.mock('@/react/common/stacks/common/confirm-stack-update', () => ({
  confirmStackUpdate: vi.fn(),
}));

vi.mock('@/react/portainer/gitops/utils', () => ({
  confirmEnableTLSVerify: vi.fn(),
}));

vi.mock('@/portainer/helpers/webhookHelper', () => ({
  baseStackWebhookUrl: vi.fn(),
  createWebhookId: vi.fn(),
}));

vi.mock('@/react/portainer/gitops/AutoUpdateFieldset/utils', () => ({
  parseAutoUpdateResponse: vi.fn(() => ({
    RepositoryAutomaticUpdates: true,
    RepositoryMechanism: 'Webhook',
    RepositoryFetchInterval: '5m',
    ForcePullImage: false,
    RepositoryAutomaticUpdatesForce: false,
  })),
  transformAutoUpdateViewModel: vi.fn(
    (_viewModel: unknown, webhookId: string) => ({
      Interval: '',
      Webhook: webhookId,
      ForceUpdate: false,
      ForcePullImage: false,
    })
  ),
}));

// Mock router hooks
vi.mock('@/react/hooks/useEnvironmentId', () => ({
  useEnvironmentId: vi.fn(() => 1),
}));

vi.mock('@/react/hooks/useCurrentEnvironment', () => ({
  useCurrentEnvironment: vi.fn(() => ({ Id: 1, Name: 'test' })),
}));

// Mock components that require router context
vi.mock('@/react/portainer/gitops/TimeWindowDisplay', () => ({
  TimeWindowDisplay: vi.fn(() => (
    <div data-testid="time-window-display">Time Window Display</div>
  )),
}));

vi.mock(
  '@/react/components/form-components/EnvironmentVariablesFieldset/StackEnvironmentVariablesPanel',
  () => ({
    StackEnvironmentVariablesPanel: vi.fn(() => (
      <div data-testid="environment-variables-panel">
        Environment Variables Panel
      </div>
    )),
  })
);

vi.mock('@/react/portainer/gitops/InfoPanel', () => ({
  InfoPanel: vi.fn(({ url, configFilePath }) => (
    <div data-testid="info-panel">
      <span>{url}</span>
      <span>{configFilePath}</span>
    </div>
  )),
}));

vi.mock('@/react/portainer/gitops/AutoUpdateFieldset', () => ({
  AutoUpdateFieldset: vi.fn(() => (
    <div data-testid="auto-update-fieldset">Auto Update Fieldset</div>
  )),
}));

vi.mock('@/react/portainer/gitops/RefField', () => ({
  RefField: vi.fn(() => <div data-testid="ref-field">Ref Field</div>),
}));

vi.mock('@/react/portainer/gitops/AuthFieldset', () => ({
  AuthFieldset: vi.fn(() => (
    <div data-testid="auth-fieldset">
      <div>Repository Authentication</div>
    </div>
  )),
}));

vi.mock(
  '@/react/portainer/gitops/RelativePathFieldset/RelativePathFieldset',
  () => ({
    RelativePathFieldset: vi.fn(() => (
      <div data-testid="relative-path-fieldset">Relative Path Fieldset</div>
    )),
  })
);

vi.mock('@/portainer/services/notifications', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

const mockUseUpdateGitStack = vi.mocked(useUpdateGitStack);
const mockUseUpdateGitStackSettings = vi.mocked(useUpdateGitStackSettings);
const mockConfirmStackUpdate = vi.mocked(confirmStackUpdate);
const mockConfirmEnableTLSVerify = vi.mocked(confirmEnableTLSVerify);
const mockBaseStackWebhookUrl = vi.mocked(baseStackWebhookUrl);
const mockCreateWebhookId = vi.mocked(createWebhookId);

describe('StackRedeployGitForm', () => {
  const defaultProps: StackRedeployGitFormProps = {
    model: {
      URL: 'https://github.com/test/repo',
      ReferenceName: 'refs/heads/main',
      ConfigFilePath: 'docker-compose.yml',
      ConfigHash: 'abc123',
      TLSSkipVerify: false,
    },
    stack: {
      Id: 1,
      EndpointId: 1,
      Type: 1, // Swarm stack
      Env: [
        { name: 'ENV1', value: 'value1' },
        { name: 'ENV2', value: 'value2' },
      ],
      Option: {
        Prune: false,
      },
      AdditionalFiles: ['file1.yml', 'file2.yml'],
      AutoUpdate: {
        Interval: '5m',
        Webhook: 'test-webhook-id',
        ForceUpdate: false,
        ForcePullImage: false,
      },
    },
    endpoint: {
      apiVersion: 1.27,
      Id: 1,
    },
  };

  const mockUpdateGitStackMutation = {
    mutateAsync: vi.fn(),
    isLoading: false,
    error: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const mockUpdateGitStackSettingsMutation = {
    mutateAsync: vi.fn(),
    isLoading: false,
    error: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseUpdateGitStack.mockReturnValue(mockUpdateGitStackMutation as any);
    mockUseUpdateGitStackSettings.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUpdateGitStackSettingsMutation as any
    );
    mockConfirmStackUpdate.mockResolvedValue({ pullImage: false });
    mockConfirmEnableTLSVerify.mockResolvedValue(true);
    mockBaseStackWebhookUrl.mockReturnValue(
      'http://localhost:9000/api/webhooks'
    );
    mockCreateWebhookId.mockReturnValue('test-webhook-id');
  });

  function renderComponent(props = {}) {
    const Component = withTestQueryProvider(
      withTestRouter(() => (
        <StackRedeployGitForm {...defaultProps} {...props} />
      ))
    );
    return render(<Component />);
  }

  describe('Basic rendering', () => {
    it('should render the form with correct sections', () => {
      renderComponent();

      expect(
        screen.getByText('Redeploy from git repository')
      ).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should display repository information in InfoPanel', () => {
      renderComponent();

      expect(
        screen.getByText('https://github.com/test/repo')
      ).toBeInTheDocument();
      expect(screen.getByText('docker-compose.yml')).toBeInTheDocument();
    });

    it('should show advanced configuration toggle button', () => {
      renderComponent();

      expect(screen.getByText('Advanced configuration')).toBeInTheDocument();
      expect(
        screen.getByTestId('advanced-configuration-toggle-button')
      ).toBeInTheDocument();
    });

    it('should show Pull and redeploy button', () => {
      renderComponent();

      expect(screen.getByText('Pull and redeploy')).toBeInTheDocument();
      expect(screen.getByTestId('stack-redeploy-button')).toBeInTheDocument();
    });

    it('should show Save settings button', () => {
      renderComponent();

      expect(screen.getByText('Save settings')).toBeInTheDocument();
      expect(
        screen.getByTestId('stack-save-settings-button')
      ).toBeInTheDocument();
    });
  });

  describe('Advanced configuration toggle', () => {
    it('should show advanced configuration when toggle is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      expect(screen.getByText('Hide configuration')).toBeInTheDocument();
      expect(screen.getByText('Skip TLS Verification')).toBeInTheDocument();
    });

    it('should hide advanced configuration when toggle is clicked again', async () => {
      const user = userEvent.setup();
      renderComponent();

      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);
      await user.click(toggleButton);

      expect(screen.getByText('Advanced configuration')).toBeInTheDocument();
      expect(
        screen.queryByText('Skip TLS Verification')
      ).not.toBeInTheDocument();
    });
  });

  describe('TLS Skip Verification', () => {
    it('should show TLS skip verification switch in advanced config', async () => {
      const user = userEvent.setup();
      renderComponent();

      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      expect(
        screen.getByTestId('gitops-skip-tls-verification-switch')
      ).toBeInTheDocument();
    });

    it('should call confirmEnableTLSVerify when enabling TLS verification', async () => {
      const user = userEvent.setup();
      const propsWithTLSDisabled = {
        ...defaultProps,
        model: { ...defaultProps.model, TLSSkipVerify: true },
      };
      renderComponent(propsWithTLSDisabled);

      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      expect(mockConfirmEnableTLSVerify).toHaveBeenCalled();
    });
  });

  describe('Options section', () => {
    it('should show prune services option for swarm stacks with API version >= 1.27', () => {
      renderComponent();

      expect(screen.getByText('Prune services')).toBeInTheDocument();
      expect(
        screen.getByTestId('stack-prune-services-switch')
      ).toBeInTheDocument();
    });

    it('should not show options section for non-swarm stacks', () => {
      const propsWithComposeStack = {
        ...defaultProps,
        stack: { ...defaultProps.stack, Type: 2 }, // Compose stack
      };
      renderComponent(propsWithComposeStack);

      expect(screen.queryByText('Options')).not.toBeInTheDocument();
    });

    it('should not show options section for older API versions', () => {
      const propsWithOldAPI = {
        ...defaultProps,
        endpoint: { ...defaultProps.endpoint, apiVersion: 1.26 },
      };
      renderComponent(propsWithOldAPI);

      expect(screen.queryByText('Options')).not.toBeInTheDocument();
    });
  });

  describe('Pull and redeploy functionality', () => {
    it('should call confirmStackUpdate when redeploy button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const redeployButton = screen.getByTestId('stack-redeploy-button');
      await user.click(redeployButton);

      expect(mockConfirmStackUpdate).toHaveBeenCalledWith(
        'Any changes to this stack or application made locally in Portainer will be overridden, which may cause service interruption. Do you wish to continue?',
        true
      );
    });

    it('should call updateGitStack mutation when confirmed', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackMutation.mutateAsync.mockResolvedValue({});
      renderComponent();

      const redeployButton = screen.getByTestId('stack-redeploy-button');
      await user.click(redeployButton);

      await waitFor(() => {
        expect(mockUpdateGitStackMutation.mutateAsync).toHaveBeenCalledWith({
          env: defaultProps.stack.Env,
          prune: false,
          RepositoryReferenceName: 'refs/heads/main',
          RepositoryAuthentication: false,
          RepositoryGitCredentialID: 0,
          RepositoryUsername: '',
          RepositoryPassword: '',
          PullImage: false,
        });
      });
    });

    it('should notify success on successful redeploy', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackMutation.mutateAsync.mockResolvedValue({});

      renderComponent();

      const redeployButton = screen.getByTestId('stack-redeploy-button');
      await user.click(redeployButton);

      await waitFor(() => {
        expect(notifySuccess).toHaveBeenCalled();
      });
    });

    it('should disable redeploy button when in progress', async () => {
      const user = userEvent.setup();
      // Mock the mutation to simulate loading state
      mockUpdateGitStackMutation.mutateAsync.mockImplementation(
        () => new Promise(() => {})
      ); // Never resolves
      renderComponent();

      const redeployButton = screen.getByTestId('stack-redeploy-button');
      await user.click(redeployButton);

      // The button should be disabled during the redeploy process
      await waitFor(() => {
        expect(redeployButton).toBeDisabled();
      });
    });
  });

  describe('Save settings functionality', () => {
    it('should call updateGitStackSettings mutation when save button is clicked', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackSettingsMutation.mutateAsync.mockResolvedValue({});
      renderComponent();

      // Make a change to enable the save button
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      const saveButton = screen.getByTestId('stack-save-settings-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(
          mockUpdateGitStackSettingsMutation.mutateAsync
        ).toHaveBeenCalledWith({
          stackId: 1,
          endpointId: 1,
          payload: expect.objectContaining({
            env: defaultProps.stack.Env,
            RepositoryReferenceName: 'refs/heads/main',
            prune: false,
            TLSSkipVerify: true,
          }),
        });
      });
    });

    it('should disable save button when no changes are made', () => {
      renderComponent();

      const saveButton = screen.getByTestId('stack-save-settings-button');
      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when changes are made', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Make a change to enable the save button
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      const saveButton = screen.getByTestId('stack-save-settings-button');
      expect(saveButton).not.toBeDisabled();
    });

    it('should disable save button when in progress', () => {
      mockUpdateGitStackSettingsMutation.isLoading = true;
      renderComponent();

      const saveButton = screen.getByTestId('stack-save-settings-button');
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Form state management', () => {
    it('should track unsaved changes correctly', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially no unsaved changes
      const saveButton = screen.getByTestId('stack-save-settings-button');
      expect(saveButton).toBeDisabled();

      // Make a change
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      // Should now have unsaved changes
      expect(saveButton).not.toBeDisabled();
    });

    it('should clear unsaved changes after successful save', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackSettingsMutation.mutateAsync.mockResolvedValue({});
      renderComponent();

      // Make a change
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      // Save the changes
      const saveButton = screen.getByTestId('stack-save-settings-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle updateGitStack mutation errors gracefully', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackMutation.mutateAsync.mockRejectedValue(
        new Error('Update failed')
      );
      renderComponent();

      const redeployButton = screen.getByTestId('stack-redeploy-button');
      await user.click(redeployButton);

      await waitFor(() => {
        expect(notifyError).toHaveBeenCalled();
      });
    });

    it('should handle updateGitStackSettings mutation errors gracefully', async () => {
      const user = userEvent.setup();
      mockUpdateGitStackSettingsMutation.mutateAsync.mockRejectedValue(
        new Error('Save failed')
      );
      renderComponent();

      // Make a change to enable save button
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      const saveButton = screen.getByTestId('stack-save-settings-button');
      await user.click(saveButton);

      // Should not clear unsaved changes on error
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe('Git authentication', () => {
    it('should handle git authentication configuration', async () => {
      const user = userEvent.setup();
      const propsWithAuth = {
        ...defaultProps,
        stack: {
          ...defaultProps.stack,
          GitConfig: {
            Authentication: {
              Username: 'testuser',
              Password: 'testpass',
              GitCredentialID: 0,
            },
          },
        },
      };
      renderComponent(propsWithAuth);

      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      // Should show authentication fields
      expect(screen.getByText('Repository Authentication')).toBeInTheDocument();
    });
  });

  describe('Webhook configuration', () => {
    it('should generate webhook ID when no webhook is provided and use it in save settings', async () => {
      const user = userEvent.setup();
      const propsWithoutWebhook = {
        ...defaultProps,
        stack: {
          ...defaultProps.stack,
          AutoUpdate: {
            ...defaultProps.stack.AutoUpdate,
            Webhook: '',
          },
        },
      };
      mockCreateWebhookId.mockReturnValue('generated-webhook-id');
      mockUpdateGitStackSettingsMutation.mutateAsync.mockResolvedValue({});
      renderComponent(propsWithoutWebhook);

      expect(mockCreateWebhookId).toHaveBeenCalled();

      // Make a change to enable save button
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      const saveButton = screen.getByTestId('stack-save-settings-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(
          mockUpdateGitStackSettingsMutation.mutateAsync
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            stackId: 1,
            endpointId: 1,
            payload: expect.objectContaining({
              AutoUpdate: expect.objectContaining({
                Webhook: 'generated-webhook-id',
              }),
            }),
          })
        );
      });
    });

    it('should use existing webhook ID from stack without generating new one', async () => {
      const user = userEvent.setup();
      const propsWithWebhook = {
        ...defaultProps,
        stack: {
          ...defaultProps.stack,
          AutoUpdate: {
            ...defaultProps.stack.AutoUpdate,
            Webhook: 'existing-webhook-id',
          },
        },
      };
      mockUpdateGitStackSettingsMutation.mutateAsync.mockResolvedValue({});
      renderComponent(propsWithWebhook);

      expect(mockCreateWebhookId).not.toHaveBeenCalled();

      // Make a change to enable save button
      const toggleButton = screen.getByTestId(
        'advanced-configuration-toggle-button'
      );
      await user.click(toggleButton);

      const tlsSwitch = screen.getByTestId(
        'gitops-skip-tls-verification-switch'
      );
      await user.click(tlsSwitch);

      const saveButton = screen.getByTestId('stack-save-settings-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(
          mockUpdateGitStackSettingsMutation.mutateAsync
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            stackId: 1,
            endpointId: 1,
            payload: expect.objectContaining({
              AutoUpdate: expect.objectContaining({
                Webhook: 'existing-webhook-id',
              }),
            }),
          })
        );
      });
    });
  });
});
