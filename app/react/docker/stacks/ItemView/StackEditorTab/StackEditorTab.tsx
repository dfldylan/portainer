import { Formik } from 'formik';
import { useRouter } from '@uirouter/react';

import { Stack, StackType } from '@/react/common/stacks/types';
import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';
import { useApiVersion } from '@/react/docker/proxy/queries/useVersion';
import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';

import { useUpdateStackMutation } from '../../useUpdateStack';

import { StackEditorFormValues } from './StackEditorTab.types';
import { getValidationSchema } from './StackEditorTab.validation';
import { StackEditorTabInner } from './StackEditorTabInner';

interface StackEditorTabProps {
  stackType: StackType;
  composeSyntaxMaxVersion: number;
  isOrphaned: boolean;
  initialValues: Partial<StackEditorFormValues>;
  containerNames?: string[];
  originalContainerNames?: string[];
  versions: Array<number>;
  stackId: Stack['Id'];

  onSubmit?(): void;
  onSubmitSettled?(): void;
}

export function StackEditorTab({
  stackType,
  composeSyntaxMaxVersion,
  isOrphaned,
  initialValues,
  containerNames = [],
  originalContainerNames = [],
  versions,
  stackId,
  onSubmit = () => {},
  onSubmitSettled = () => {},
}: StackEditorTabProps) {
  const router = useRouter();
  const mutation = useUpdateStackMutation();
  const envQuery = useCurrentEnvironment();
  const schemaQuery = useDockerComposeSchema();
  const apiVersion = useApiVersion(envQuery.data?.Id);

  if (!envQuery.data || !schemaQuery.data) {
    return null;
  }

  const envType = envQuery.data?.Type;

  return (
    <Formik
      initialValues={{
        registries: [],
        stackFileContent: '',
        environmentVariables: [],
        webhookId: '',
        prune: false,
        ...initialValues,
      }}
      validationSchema={getValidationSchema(
        containerNames,
        originalContainerNames
      )}
      onSubmit={async (values) => {
        onSubmit();
        const response = await confirmStackUpdate(
          'Do you want to force an update of the stack?',
          stackType === StackType.DockerSwarm
        );

        if (!response) {
          return;
        }

        mutation.mutate(
          {
            stackId,
            environmentId: envQuery.data.Id,
            payload: {
              stackFileContent: values.stackFileContent,
              env: values.environmentVariables,
              prune: values.prune,
              webhook: values.webhookId,
              pullImage: response.pullImage,
              rollbackTo: values.rollbackTo,
              registries: values.registries,
            },
          },
          {
            onSuccess() {
              notifySuccess('Success', 'Stack successfully deployed');
              router.stateService.reload();
            },
            onError(err) {
              notifyError('Failure', err as Error, 'Unable to create stack');
            },
            onSettled() {
              onSubmitSettled();
            },
          }
        );
      }}
      validateOnMount
      enableReinitialize
    >
      <StackEditorTabInner
        stackId={stackId}
        stackType={stackType}
        composeSyntaxMaxVersion={composeSyntaxMaxVersion}
        isOrphaned={isOrphaned}
        apiVersion={apiVersion}
        envType={envType}
        schema={schemaQuery.data}
        versions={versions}
        isSaved={mutation.isSuccess}
      />
    </Formik>
  );
}
