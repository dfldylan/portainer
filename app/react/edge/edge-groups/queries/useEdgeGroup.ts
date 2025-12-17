import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import {
  EnvironmentId,
  EnvironmentType,
} from '@CE/react/portainer/environments/types';
import { withError } from '@CE/react-tools/react-query';

import { EdgeGroup } from '../types';

import { queryKeys } from './query-keys';
import { buildUrl } from './build-url';

export interface EdgeGroupListItemResponse extends EdgeGroup {
  EndpointTypes: Array<EnvironmentType>;
  HasEdgeStack?: boolean;
  HasEdgeJob?: boolean;
  HasEdgeConfig?: boolean;
  TrustedEndpoints: Array<EnvironmentId>;
}

async function getEdgeGroup(id: EdgeGroup['Id']) {
  try {
    const { data } = await axios.get<EdgeGroup>(buildUrl({ id }));
    return data;
  } catch (err) {
    throw parseAxiosError(err as Error, 'Failed fetching edge groups');
  }
}

export function useEdgeGroup<T = EdgeGroup>(
  id?: EdgeGroup['Id'],
  {
    select,
  }: {
    select?: (groups: EdgeGroup) => T;
  } = {}
) {
  return useQuery({
    queryKey: queryKeys.item(id!),
    queryFn: () => getEdgeGroup(id!),
    select,
    enabled: !!id,
    ...withError('Failed fetching edge group'),
  });
}
