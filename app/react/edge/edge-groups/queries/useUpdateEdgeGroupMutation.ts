import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { TagId } from '@CE/portainer/tags/types';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { EdgeGroup } from '../types';

import { buildUrl } from './build-url';
import { queryKeys } from './query-keys';

interface UpdateGroupPayload {
  id: EdgeGroup['Id'];
  name: string;
  dynamic: boolean;
  tagIds?: TagId[];
  endpoints?: EnvironmentId[];
  partialMatch?: boolean;
}

export async function updateEdgeGroup({
  id,
  ...requestPayload
}: UpdateGroupPayload) {
  try {
    const { data: group } = await axios.put<EdgeGroup>(
      buildUrl({ id }),
      requestPayload
    );
    return group;
  } catch (e) {
    throw parseAxiosError(e as Error, 'Failed to update Edge group');
  }
}

export function useUpdateEdgeGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateEdgeGroup,
    mutationOptions(
      withError('Failed to update Edge group'),
      withInvalidate(queryClient, [queryKeys.base()])
    )
  );
}
