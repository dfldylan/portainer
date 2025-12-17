import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import { TagId } from '@CE/portainer/tags/types';
import { queryKeys as edgeGroupQueryKeys } from '@CE/react/edge/edge-groups/queries/query-keys';
import { queryKeys as groupQueryKeys } from '@CE/react/portainer/environments/environment-groups/queries/query-keys';
import { tagKeys } from '@CE/portainer/tags/queries';

import { EnvironmentId, EnvironmentGroupId } from '../types';
import { buildUrl } from '../environment.service/utils';

import { environmentQueryKeys } from './query-keys';

export function useUpdateEnvironmentsRelationsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateEnvironmentRelations,
    mutationOptions(
      withInvalidate(queryClient, [
        environmentQueryKeys.base(),
        edgeGroupQueryKeys.base(),
        groupQueryKeys.base(),
        tagKeys.all,
      ]),
      withError('Unable to update environment relations')
    )
  );
}

export interface EnvironmentRelationsPayload {
  edgeGroups: Array<EdgeGroup['Id']>;
  group: EnvironmentGroupId;
  tags: Array<TagId>;
}

export async function updateEnvironmentRelations(
  relations: Record<EnvironmentId, EnvironmentRelationsPayload>
) {
  try {
    await axios.put(buildUrl(undefined, 'relations'), { relations });
  } catch (e) {
    throw parseAxiosError(e as Error, 'Unable to update environment relations');
  }
}
