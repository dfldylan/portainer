import { useMutation } from '@tanstack/react-query';

import { queryClient, withGlobalError } from '@CE/react-tools/react-query';
import axios from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import {
  error as notifyError,
  notifySuccess,
} from '@CE/portainer/services/notifications';
import { isFulfilled, isRejected } from '@CE/portainer/helpers/promise-utils';
import { pluralize } from '@CE/portainer/helpers/strings';

import { parseKubernetesAxiosError } from '../../axiosError';

import { secretQueryKeys } from './query-keys';

export function useDeleteSecrets(environmentId: EnvironmentId) {
  return useMutation(
    async (secrets: { namespace: string; name: string }[]) => {
      const promises = await Promise.allSettled(
        secrets.map(({ namespace, name }) =>
          deleteSecret(environmentId, namespace, name)
        )
      );
      const successfulSecrets = promises
        .filter(isFulfilled)
        .map((_, index) => secrets[index].name);
      const failedSecrets = promises
        .filter(isRejected)
        .map(({ reason }, index) => ({
          name: secrets[index].name,
          reason,
        }));
      return { failedSecrets, successfulSecrets };
    },
    {
      ...withGlobalError('Unable to remove secrets'),
      onSuccess: ({ failedSecrets, successfulSecrets }) => {
        // show an error message for each secret that failed to delete
        failedSecrets.forEach(({ name, reason }) => {
          notifyError(
            `Failed to remove secret '${name}'`,
            new Error(reason.message) as Error
          );
        });
        // show one summary message for all successful deletes
        if (successfulSecrets.length) {
          notifySuccess(
            `${pluralize(
              successfulSecrets.length,
              'Secret'
            )} successfully removed`,
            successfulSecrets.join(', ')
          );
        }
        queryClient.invalidateQueries({
          queryKey: secretQueryKeys.secretsForCluster(environmentId),
        });
      },
    }
  );
}

async function deleteSecret(
  environmentId: EnvironmentId,
  namespace: string,
  name: string
) {
  try {
    await axios.delete(
      `/endpoints/${environmentId}/kubernetes/api/v1/namespaces/${namespace}/secrets/${name}`
    );
  } catch (e) {
    throw parseKubernetesAxiosError(e, 'Unable to remove secret');
  }
}
