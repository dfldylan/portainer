import { useMutation } from '@tanstack/react-query';

import { EnvironmentId } from '@CE/react/portainer/environments/types';
import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { promiseSequence } from '@CE/portainer/helpers/promise-utils';
import { withError } from '@CE/react-tools/react-query';

import { buildUrl } from '../../queries/build-url';
import { removeWebhooksForService } from '../../webhooks/removeWebhook';

export function useRemoveServicesMutation(environmentId: EnvironmentId) {
  return useMutation(
    (ids: Array<string>) =>
      promiseSequence(ids.map((id) => () => removeService(environmentId, id))),
    withError('Unable to remove services')
  );
}

export async function removeService(
  environmentId: EnvironmentId,
  serviceId: string
) {
  try {
    await axios.delete(buildUrl(environmentId, serviceId));

    await removeWebhooksForService(environmentId, serviceId);
  } catch (error) {
    throw parseAxiosError(error);
  }
}
