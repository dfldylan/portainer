import { Formik } from 'formik';
import { useCurrentStateAndParams, useRouter } from '@uirouter/react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';
import {
  useCreateStack,
  CreateStackPayload,
} from '@/react/common/stacks/queries/useCreateStack/useCreateStack';
import { useCurrentUser, useIsEdgeAdmin } from '@/react/hooks/useUser';
import { defaultValues } from '@/react/portainer/access-control/utils';
import { getDefaultModel } from '@/react/portainer/gitops/types';

import { FormValues } from './types';
import { useValidationSchema } from './useValidationSchema';
import { InnerForm } from './InnerForm';

interface Props {
  environmentId: EnvironmentId;
  isSwarm: boolean;
  swarmId: string;
}

export function CreateStackForm({ environmentId, isSwarm, swarmId }: Props) {
  const router = useRouter();
  const {
    params: { yaml },
  } = useCurrentStateAndParams();
  const createStackMutation = useCreateStack();
  const { user } = useCurrentUser();
  const { isAdmin } = useIsEdgeAdmin();

  const validationSchema = useValidationSchema(environmentId);

  const initialValues: FormValues = {
    method: 'editor',
    name: '',
    editor: {
      fileContent: yaml || '',
    },
    upload: {
      file: null,
    },
    git: {
      ...getDefaultModel(),
      SupportRelativePath: false,
      FilesystemPath: '',
    },
    template: {
      fileContent: '',
      selectedId: undefined,
      variables: [],
    },
    env: [],
    webhookId: '',
    registries: [],
    accessControl: defaultValues(isAdmin, user.Id),
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      <InnerForm
        isDeploying={createStackMutation.isLoading}
        isSwarm={isSwarm}
        isSaved={createStackMutation.isSuccess}
      />
    </Formik>
  );

  async function handleSubmit(values: FormValues) {
    const stackType = isSwarm ? 'swarm' : 'standalone';

    const payload = buildCreateStackPayload(
      values,
      environmentId,
      stackType,
      swarmId
    );

    createStackMutation.mutate(payload, {
      onSuccess: () => {
        notifySuccess('Success', 'Stack successfully deployed');
        router.stateService.go('docker.stacks');
      },
    });
  }
}

function buildCreateStackPayload(
  values: FormValues,
  environmentId: EnvironmentId,
  stackType: 'swarm' | 'standalone',
  swarmId: string
): CreateStackPayload {
  const basePayload = {
    name: values.name,
    environmentId,
    env: values.env,
    accessControl: values.accessControl,
    registries: values.registries,
  };

  switch (values.method) {
    case 'editor':
      if (stackType === 'swarm') {
        return {
          type: 'swarm',
          method: 'string',
          payload: {
            ...basePayload,
            swarmId,
            fileContent: values.editor.fileContent,
            webhook: values.webhookId,
          },
        };
      }
      return {
        type: 'standalone',
        method: 'string',
        payload: {
          ...basePayload,
          fileContent: values.editor.fileContent,
          webhook: values.webhookId,
        },
      };

    case 'upload':
      if (!values.upload.file) {
        throw new Error('File is required for upload method');
      }
      if (stackType === 'swarm') {
        return {
          type: 'swarm',
          method: 'file',
          payload: {
            ...basePayload,
            swarmId,
            file: values.upload.file,
            webhook: values.webhookId,
          },
        };
      }
      return {
        type: 'standalone',
        method: 'file',
        payload: {
          ...basePayload,
          file: values.upload.file,
          webhook: values.webhookId,
        },
      };

    case 'repository':
      if (stackType === 'swarm') {
        return {
          type: 'swarm',
          method: 'git',
          payload: {
            ...basePayload,
            swarmId,
            git: values.git,
            relativePathSettings: values.git.SupportRelativePath
              ? {
                  SupportRelativePath: true,
                  FilesystemPath: values.git.FilesystemPath,
                  SupportPerDeviceConfigs: false,
                  PerDeviceConfigsPath: '',
                  PerDeviceConfigsMatchType: '',
                  PerDeviceConfigsGroupMatchType: '',
                }
              : undefined,
          },
        };
      }
      return {
        type: 'standalone',
        method: 'git',
        payload: {
          ...basePayload,
          git: values.git,
          relativePathSettings: values.git.SupportRelativePath
            ? {
                SupportRelativePath: true,
                FilesystemPath: values.git.FilesystemPath,
                SupportPerDeviceConfigs: false,
                PerDeviceConfigsPath: '',
                PerDeviceConfigsMatchType: '',
                PerDeviceConfigsGroupMatchType: '',
              }
            : undefined,
        },
      };

    case 'template':
      if (stackType === 'swarm') {
        return {
          type: 'swarm',
          method: 'string',
          payload: {
            ...basePayload,
            swarmId,
            fileContent: values.template.fileContent,
            webhook: values.webhookId,
            fromAppTemplate: true,
          },
        };
      }
      return {
        type: 'standalone',
        method: 'string',
        payload: {
          ...basePayload,
          fileContent: values.template.fileContent,
          webhook: values.webhookId,
          fromAppTemplate: true,
        },
      };

    default:
      throw new Error('Invalid method');
  }
}
