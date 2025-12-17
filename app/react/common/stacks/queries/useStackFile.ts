import { useQuery } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { withGlobalError } from '@CE/react-tools/react-query';

import { StackFile, StackId } from '../types';

import { queryKeys } from './query-keys';

export function useStackFile(
  stackId?: StackId,
  { version, commitHash }: { version?: number; commitHash?: string } = {},
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery(
    queryKeys.stackFile(stackId, { version, commitHash }),
    () => getStackFile(stackId!, { version, commitHash }),
    {
      ...withGlobalError('Unable to retrieve stack'),
      enabled: !!stackId && enabled,
    }
  );
}

export async function getStackFile(
  stackId: StackId,
  { version, commitHash }: { version?: number; commitHash?: string } = {}
) {
  try {
    const { data } = await axios.get<StackFile>(`/stacks/${stackId}/file`, {
      params: { version, commitHash },
    });
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to retrieve stack file');
  }
}
