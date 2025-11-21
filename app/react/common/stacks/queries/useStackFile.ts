import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { StackFile, StackId } from '../types';

import { queryKeys } from './query-keys';

export function useStackFile(
  stackId?: StackId,
  { version }: { version?: string | number } = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery(
    queryKeys.stackFile(stackId, { version }),
    () => getStackFile(stackId!, { version }),
    {
      ...withGlobalError('Unable to retrieve stack'),
      enabled: !!stackId && enabled,
    }
  );
}

export async function getStackFile(
  stackId: StackId,
  { version }: { version?: string | number } = {}
) {
  try {
    const { data } = await axios.get<StackFile>(`/stacks/${stackId}/file`, {
      params: { version },
    });
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to retrieve stack file');
  }
}
