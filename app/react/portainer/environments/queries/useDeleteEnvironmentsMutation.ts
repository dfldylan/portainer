import { useQueryClient, useMutation } from '@tanstack/react-query';

import { promiseSequence } from '@CE/portainer/helpers/promise-utils';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { deleteEndpoint } from '../environment.service';

export function useDeleteEnvironmentsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: Array<EnvironmentId>) =>
      promiseSequence(ids.map((id) => () => deleteEndpoint(id))),
    mutationOptions(
      withError('Failed to remove environments'),
      withInvalidate(queryClient, [['environments']])
    )
  );
}
