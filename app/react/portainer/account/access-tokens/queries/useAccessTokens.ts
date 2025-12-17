import { useQuery } from '@tanstack/react-query';

import { useCurrentUser } from '@CE/react/hooks/useUser';
import axios, { parseAxiosError } from '@CE/portainer/services/axios';

import { AccessToken } from '../types';

import { queryKeys } from './query-keys';
import { buildUrl } from './build-url';

export function useAccessTokens() {
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.base(user.Id),
    queryFn: () => getAccessTokens(user.Id),
  });
}

async function getAccessTokens(userId: number) {
  try {
    const { data } = await axios.get<Array<AccessToken>>(buildUrl(userId));
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to get access tokens');
  }
}
