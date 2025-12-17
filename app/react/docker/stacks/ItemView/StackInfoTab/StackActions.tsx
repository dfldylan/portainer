import {
  ArrowRightIcon,
  PlayIcon,
  PlusIcon,
  StopCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { Authorized } from '@CE/react/hooks/useUser';
import { Stack, StackStatus } from '@CE/react/common/stacks/types';
import { useDeleteStackMutation } from '@CE/react/common/stacks/queries/useDeleteStackMutation';
import {
  notifyError,
  notifySuccess,
} from '@CE/portainer/services/notifications';

import { Button, LoadingButton } from '@@CE/buttons';
import { Link } from '@@CE/Link';
import { confirm, confirmDelete } from '@@CE/modals/confirm';
import { ModalType } from '@@CE/modals/Modal/types';
import { buildConfirmButton } from '@@CE/modals/utils';

import { useUpdateStackMutation } from '../../useUpdateStack';

import { useStartStackMutation } from './useStartStackMutation';
import { useStopStackMutation } from './useStopStackMutation';

export function StackActions({
  stack,
  fileContent,
  isRegular,
  environmentId,
  isExternal,
  status,
}: {
  stack: Stack;
  fileContent?: string;
  isRegular?: boolean;
  environmentId: number;
  isExternal: boolean;
  status: Stack['Status'];
}) {
  const router = useRouter();
  const startStackMutation = useStartStackMutation();
  const stopStackMutation = useStopStackMutation();
  const deleteStackMutation = useDeleteStackMutation();
  const detachFromGitMutation = useUpdateStackMutation();

  const isMutating =
    startStackMutation.isLoading ||
    stopStackMutation.isLoading ||
    deleteStackMutation.isLoading ||
    detachFromGitMutation.isLoading;

  const stackId = stack.Id;

  return (
    <div className="flex items-center gap-2">
      {isRegular && (
        <Authorized authorizations="PortainerStackUpdate">
          {status === StackStatus.Active ? (
            <Button
              icon={StopCircleIcon}
              color="dangerlight"
              size="xsmall"
              onClick={() => handleStop()}
              disabled={isMutating}
              data-cy="stack-stop-btn"
            >
              Stop this stack
            </Button>
          ) : (
            <Button
              icon={PlayIcon}
              color="success"
              data-cy="stack-start-btn"
              size="xsmall"
              disabled={isMutating}
              onClick={() =>
                startStackMutation.mutate(
                  { id: stackId, environmentId },
                  {
                    onError(err) {
                      notifyError(
                        'Failure',
                        err as Error,
                        'Unable to start stack'
                      );
                    },
                    onSuccess() {
                      notifySuccess(
                        'Success',
                        `Stack ${stack.Name} started successfully`
                      );
                      router.stateService.reload();
                    },
                  }
                )
              }
            >
              Start this stack
            </Button>
          )}
        </Authorized>
      )}

      <Authorized authorizations="PortainerStackDelete">
        <Button
          icon={Trash2Icon}
          color="dangerlight"
          size="xsmall"
          onClick={() => handleDelete()}
          disabled={isMutating}
          data-cy="stack-delete-btn"
        >
          Delete this stack
        </Button>
      </Authorized>

      {!!(isRegular && fileContent) && (
        <Button
          as={Link}
          icon={PlusIcon}
          color="primary"
          size="xsmall"
          data-cy="stack-create-template-btn"
          props={{
            to: 'docker.templates.custom.new',
            params: {
              fileContent,
              type: stack.Type,
            },
          }}
        >
          Create template from stack
        </Button>
      )}

      {!!(
        isRegular &&
        fileContent &&
        !stack.FromAppTemplate &&
        stack.GitConfig
      ) && (
        <Authorized authorizations="PortainerStackUpdate">
          <LoadingButton
            icon={ArrowRightIcon}
            color="primary"
            size="xsmall"
            onClick={() => handleDetachFromGit()}
            disabled={isMutating}
            data-cy="stack-detach-git-btn"
            isLoading={detachFromGitMutation.isLoading}
            loadingText="Detachment in progress..."
          >
            Detach from Git
          </LoadingButton>
        </Authorized>
      )}
    </div>
  );

  async function handleStop() {
    const confirmed = await confirm({
      title: 'Are you sure?',
      modalType: ModalType.Warn,
      message: 'Are you sure you want to stop this stack?',
      confirmButton: buildConfirmButton('Stop', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    stopStackMutation.mutate(
      { id: stackId, environmentId },
      {
        onError(err) {
          notifyError('Failure', err as Error, 'Unable to stop stack');
        },
        onSuccess() {
          notifySuccess('Success', `Stack ${stack.Name} stopped successfully`);
          router.stateService.reload();
        },
      }
    );
  }

  async function handleDelete() {
    const confirmed = await confirmDelete(
      'Do you want to remove the stack? Associated services will be removed as well'
    );
    if (!confirmed) {
      return;
    }
    deleteStackMutation.mutate(
      {
        id: stack.Id,
        name: stack.Name,
        environmentId: stack.EndpointId,
        external: isExternal,
      },
      {
        onError(err) {
          notifyError(
            'Failure',
            err as Error,
            `Unable to remove stack ${stack.Name}`
          );
        },
        onSuccess() {
          notifySuccess('Stack successfully removed', stack.Name);
          router.stateService.go('^');
        },
      }
    );
  }

  async function handleDetachFromGit() {
    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: 'Are you sure?',
      message: 'Do you want to detach the stack from Git?',
      confirmButton: buildConfirmButton('Detach', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    detachFromGitMutation.mutate(
      {
        environmentId,
        stackId: stack.Id,
        payload: {
          stackFileContent: fileContent!,
          env: stack.Env,
          prune: false,
        },
      },
      {
        onSuccess() {
          router.stateService.go('^');
        },
      }
    );
  }
}
