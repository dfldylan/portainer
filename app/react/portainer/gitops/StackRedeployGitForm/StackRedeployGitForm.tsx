import { useState, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { GitStackPayload } from '@/react/common/stacks/types';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';
import {
  baseStackWebhookUrl,
  createWebhookId,
} from '@/portainer/helpers/webhookHelper';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';

import { Icon } from '@@/Icon';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { Button } from '@@/buttons/Button';
import { SwitchField } from '@@/form-components/SwitchField/SwitchField';
import { FormSection } from '@@/form-components/FormSection/FormSection';
import { StackEnvironmentVariablesPanel } from '@@/form-components/EnvironmentVariablesFieldset/StackEnvironmentVariablesPanel';

import { useUpdateGitStack } from '../queries/useUpdateGitStack';
import { useUpdateGitStackSettings } from '../queries/useUpdateGitStackSettings';
import { GitFormModel, AutoUpdateModel, AutoUpdateResponse } from '../types';
import { RelativePathModel } from '../RelativePathFieldset/types';
import {
  parseAutoUpdateResponse,
  transformAutoUpdateViewModel,
} from '../AutoUpdateFieldset/utils';
import { confirmEnableTLSVerify } from '../utils';
import { InfoPanel } from '../InfoPanel';
import { AutoUpdateFieldset } from '../AutoUpdateFieldset';
import { RefField } from '../RefField';
import { AuthFieldset } from '../AuthFieldset';
import { RelativePathFieldset } from '../RelativePathFieldset/RelativePathFieldset';

interface StackRedeployGitFormModel extends GitFormModel {
  RefName?: string;
  Env: Array<{ name: string; value: string }>;
  Option: {
    Prune: boolean;
  };
  PullImage: boolean;
  isEdit?: boolean;
  isAuthEdit?: boolean;
  TLSSkipVerify?: boolean;
}

interface StackRedeployGitFormProps {
  model: {
    URL: string;
    ReferenceName: string;
    ConfigFilePath: string;
    ConfigHash: string;
    TLSSkipVerify: boolean;
  };
  stack: {
    Id: number;
    EndpointId: number;
    Type: number;
    Env: Array<{ name: string; value: string }>;
    Option?: {
      Prune: boolean;
    };
    AdditionalFiles?: string[];
    AutoUpdate?: AutoUpdateResponse;
    GitConfig?: {
      Authentication?: {
        Username?: string;
        Password?: string;
        GitCredentialID?: number;
      };
    };
  };
  endpoint: {
    apiVersion: number;
    Id: number;
  };
}

interface StackRedeployGitFormState {
  inProgress: boolean;
  redeployInProgress: boolean;
  showConfig: boolean;
  hasUnsavedChanges: boolean;
  baseWebhookUrl: string;
  webhookId: string;
}

export function StackRedeployGitForm({
  model,
  stack,
  endpoint,
}: StackRedeployGitFormProps) {
  const router = useRouter();
  const [state, setState] = useState<StackRedeployGitFormState>(() => ({
    inProgress: false,
    redeployInProgress: false,
    showConfig: false,
    hasUnsavedChanges: false,
    baseWebhookUrl: baseStackWebhookUrl(),
    webhookId: buildStackWebhookId({
      prev: undefined,
      stackWebhookId: stack.AutoUpdate?.Webhook,
    }),
  }));

  const [formValues, setFormValues] = useState<StackRedeployGitFormModel>({
    RepositoryURL: model.URL,
    RepositoryURLValid: true,
    ComposeFilePathInRepository: model.ConfigFilePath,
    RefName: model.ReferenceName,
    RepositoryAuthentication: false,
    RepositoryUsername: '',
    RepositoryPassword: '',
    RepositoryGitCredentialID: 0,
    SaveCredential: true,
    NewCredentialName: '',
    Env: stack.Env || [],
    Option: {
      Prune: Boolean(stack.Option?.Prune || false),
    },
    PullImage: false,
    AutoUpdate: parseAutoUpdateResponse(stack.AutoUpdate),
    TLSSkipVerify: model.TLSSkipVerify,
  });

  const [savedFormValues, setSavedFormValues] =
    useState<StackRedeployGitFormModel>({ ...formValues });

  // Use the new git stack mutation hooks
  const updateGitStackMutation = useUpdateGitStack(stack.Id, stack.EndpointId);
  const updateGitStackSettingsMutation = useUpdateGitStackSettings();

  // Initialize form values from stack data
  const initializeFormValues = useCallback(() => {
    // Extract webhook ID first - only generate if not already set
    setState((prev) => {
      const webhookId = buildStackWebhookId({
        prev: prev.webhookId,
        stackWebhookId: stack.AutoUpdate?.Webhook,
      });
      return { ...prev, webhookId };
    });

    const newFormValues = {
      RepositoryURL: model.URL,
      RepositoryURLValid: true,
      ComposeFilePathInRepository: model.ConfigFilePath,
      RefName: model.ReferenceName,
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
      RepositoryGitCredentialID: 0,
      SaveCredential: true,
      NewCredentialName: '',
      Env: stack.Env || [],
      Option: {
        Prune: Boolean(stack.Option?.Prune || false),
      },
      PullImage: false,
      AutoUpdate: parseAutoUpdateResponse(stack.AutoUpdate),
      TLSSkipVerify: model.TLSSkipVerify,
    };

    if (stack.GitConfig?.Authentication) {
      const auth = stack.GitConfig.Authentication;
      newFormValues.RepositoryUsername = auth.Username || '';
      newFormValues.RepositoryPassword = auth.Password || '';
      newFormValues.RepositoryAuthentication = true;

      if (auth.GitCredentialID && auth.GitCredentialID > 0) {
        newFormValues.SaveCredential = false;
        newFormValues.RepositoryGitCredentialID = auth.GitCredentialID;
      }
    }

    setFormValues(newFormValues);
    setSavedFormValues({ ...newFormValues });
  }, [model, stack]);

  // Initialize form values from stack data
  useEffect(() => {
    initializeFormValues();
  }, [initializeFormValues]);

  const handleChange = useCallback(
    (partialValue: Partial<StackRedeployGitFormModel>) => {
      setFormValues((prev) => {
        const newValues = { ...prev, ...partialValue };
        const hasChanges =
          JSON.stringify(savedFormValues) !== JSON.stringify(newValues);
        setState((statePrev) => ({
          ...statePrev,
          hasUnsavedChanges: hasChanges,
        }));
        return newValues;
      });
    },
    [savedFormValues]
  );

  const handleChangeTLSSkipVerify = useCallback(
    async (value: boolean) => {
      if (model.TLSSkipVerify && !value) {
        const confirmed = await confirmEnableTLSVerify();
        if (!confirmed) {
          return;
        }
      }
      handleChange({ TLSSkipVerify: value });
    },
    [model.TLSSkipVerify, handleChange]
  );

  const handleChangeAutoUpdate = useCallback(
    (values: Partial<AutoUpdateModel>) => {
      setFormValues((prev) => {
        const newValues = {
          ...prev,
          AutoUpdate: {
            ...prev.AutoUpdate!,
            ...values,
          },
        };
        const hasChanges =
          JSON.stringify(savedFormValues) !== JSON.stringify(newValues);
        setState((statePrev) => ({
          ...statePrev,
          hasUnsavedChanges: hasChanges,
        }));
        return newValues;
      });
    },
    [savedFormValues]
  );

  const handleSubmit = useCallback(async () => {
    const isSwarmStack = stack.Type === 1;
    const result = await confirmStackUpdate(
      'Any changes to this stack or application made locally in Portainer will be overridden, which may cause service interruption. Do you wish to continue?',
      isSwarmStack
    );

    if (!result) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, redeployInProgress: true }));

      const payload: GitStackPayload = {
        env: formValues.Env,
        prune: formValues.Option.Prune,
        RepositoryReferenceName: formValues.RefName,
        RepositoryAuthentication: formValues.RepositoryAuthentication,
        RepositoryGitCredentialID: formValues.RepositoryGitCredentialID,
        RepositoryUsername: formValues.RepositoryUsername,
        RepositoryPassword: formValues.RepositoryPassword,
        PullImage: result.pullImage,
      };

      await updateGitStackMutation.mutateAsync(payload);

      notifySuccess('Success', 'Pulled and redeployed stack successfully');
      router.stateService.reload();
    } catch (err) {
      notifyError('Failure', err as Error, 'Failed redeploying stack');
    } finally {
      setState((prev) => ({ ...prev, redeployInProgress: false }));
    }
  }, [
    stack.Type,
    formValues.Env,
    formValues.Option.Prune,
    formValues.RefName,
    formValues.RepositoryAuthentication,
    formValues.RepositoryGitCredentialID,
    formValues.RepositoryUsername,
    formValues.RepositoryPassword,
    updateGitStackMutation,
    router.stateService,
  ]);

  const handleSaveSettings = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, inProgress: true }));

      const autoUpdate = transformAutoUpdateViewModel(
        formValues.AutoUpdate,
        state.webhookId
      );
      const payload: GitStackPayload = {
        AutoUpdate: autoUpdate,
        env: formValues.Env,
        RepositoryReferenceName: formValues.RefName,
        RepositoryAuthentication: formValues.RepositoryAuthentication,
        RepositoryGitCredentialID: formValues.RepositoryGitCredentialID,
        RepositoryUsername: formValues.RepositoryUsername,
        RepositoryPassword: formValues.RepositoryPassword,
        prune: formValues.Option.Prune,
        TLSSkipVerify: formValues.TLSSkipVerify,
      };

      await updateGitStackSettingsMutation.mutateAsync({
        stackId: stack.Id,
        endpointId: stack.EndpointId,
        payload,
      });

      notifySuccess('Success', 'Save stack settings successfully');

      setSavedFormValues(JSON.parse(JSON.stringify(formValues)));
      setState((prev) => ({
        ...prev,
        hasUnsavedChanges: false,
        inProgress: false,
      }));
    } catch (err) {
      notifyError('Failure', err as Error, 'Unable to save stack settings');
      setState((prev) => ({ ...prev, inProgress: false }));
    }
  }, [
    formValues,
    state.webhookId,
    stack.Id,
    stack.EndpointId,
    updateGitStackSettingsMutation,
  ]);

  function disableSaveSettingsButton(): boolean {
    return Boolean(
      state.inProgress ||
        state.redeployInProgress ||
        !state.hasUnsavedChanges ||
        (formValues.RepositoryAuthentication &&
          !formValues.RepositoryPassword &&
          formValues.RepositoryGitCredentialID === 0) ||
        (formValues.RepositoryAuthentication &&
          formValues.RepositoryPassword &&
          formValues.SaveCredential &&
          !formValues.NewCredentialName)
    );
  }

  return (
    <div className="form-horizontal my-8">
      <FormSection title="Redeploy from git repository">
        <InfoPanel
          className="text-muted small"
          url={formValues.RepositoryURL}
          type="stack"
          configFilePath={formValues.ComposeFilePathInRepository}
          additionalFiles={stack.AdditionalFiles}
        />

        <AutoUpdateFieldset
          value={formValues.AutoUpdate!}
          onChange={handleChangeAutoUpdate}
          environmentType="DOCKER"
          isForcePullVisible={stack.Type !== 3}
          baseWebhookUrl={state.baseWebhookUrl}
          webhookId={state.webhookId}
          webhooksDocs="/user/docker/stacks/webhooks"
        />

        <div className="form-group">
          <div className="col-sm-12">
            <Button
              color="none"
              onClick={() =>
                setState((prev) => ({ ...prev, showConfig: !prev.showConfig }))
              }
              data-cy="advanced-configuration-toggle-button"
            >
              <Icon
                icon={state.showConfig ? 'minus' : 'plus'}
                className="mr-1"
              />
              {state.showConfig ? 'Hide' : 'Advanced'} configuration
            </Button>
          </div>
        </div>

        {state.showConfig && (
          <>
            <RefField
              value={formValues.RefName || ''}
              onChange={(value: string) => handleChange({ RefName: value })}
              model={formValues}
              isUrlValid
              stackId={stack.Id}
            />

            <AuthFieldset
              value={formValues}
              onChange={(values: Partial<GitFormModel>) => handleChange(values)}
              isAuthExplanationVisible
            />

            <div className="form-group">
              <div className="col-sm-12">
                <SwitchField
                  name="TLSSkipVerify"
                  checked={formValues.TLSSkipVerify || false}
                  tooltip="Enabling this will allow skipping TLS validation for any self-signed certificate."
                  labelClass="col-sm-3 col-lg-2"
                  label="Skip TLS Verification"
                  onChange={handleChangeTLSSkipVerify}
                  data-cy="gitops-skip-tls-verification-switch"
                />
              </div>
            </div>

            <RelativePathFieldset
              values={stack as unknown as RelativePathModel}
              gitModel={formValues}
              isEditing
              hideEdgeConfigs
              onChange={() => {}}
            />
          </>
        )}

        <StackEnvironmentVariablesPanel
          values={formValues.Env}
          onChange={(value: Array<{ name: string; value: string }>) =>
            handleChange({ Env: value })
          }
          showHelpMessage
          isFoldable
        />

        {stack.Type === 1 && endpoint.apiVersion >= 1.27 && (
          <FormSection title="Options">
            <div className="form-group">
              <div className="col-sm-12">
                <SwitchField
                  name="prune"
                  checked={formValues.Option.Prune || false}
                  tooltip="Prune services that are no longer referenced."
                  labelClass="col-sm-3 col-lg-2"
                  label="Prune services"
                  onChange={(value: boolean) =>
                    handleChange({ Option: { Prune: value } })
                  }
                  data-cy="stack-prune-services-switch"
                />
              </div>
            </div>
          </FormSection>
        )}

        <FormSection title="Actions">
          <LoadingButton
            size="small"
            color="primary"
            onClick={handleSubmit}
            disabled={
              state.inProgress ||
              state.redeployInProgress ||
              state.hasUnsavedChanges
            }
            isLoading={state.redeployInProgress}
            loadingText="In progress..."
            data-cy="stack-redeploy-button"
          >
            <RefreshCw className="mr-1" />
            Pull and redeploy
          </LoadingButton>

          <LoadingButton
            size="small"
            color="primary"
            onClick={handleSaveSettings}
            disabled={disableSaveSettingsButton()}
            isLoading={state.inProgress}
            loadingText="In progress..."
            className="ml-2"
            data-cy="stack-save-settings-button"
          >
            Save settings
          </LoadingButton>
        </FormSection>
      </FormSection>
    </div>
  );
}

function buildStackWebhookId({
  prev,
  stackWebhookId,
}: {
  prev?: string;
  stackWebhookId: string | undefined;
}) {
  if (prev) {
    return prev;
  }

  if (!stackWebhookId) {
    return createWebhookId();
  }

  return stackWebhookId;
}
