import { useQuery } from '@tanstack/react-query';

import { withGlobalError } from '@CE/react-tools/react-query';
import { getEdgeStackFile } from '@CE/react/edge/edge-stacks/queries/useEdgeStackFile';
import { getStackFile } from '@CE/react/common/stacks/queries/useStackFile';

import { queryKeys } from './query-keys';

// Return the stack file content as a string for both edge and regular stacks.
export function useAppStackFile(id?: number, kind?: string) {
  return useQuery(
    queryKeys.appStackFile(id, kind),
    async () => {
      if (!id) {
        return undefined;
      }

      if (kind === 'edge') {
        // Fetch edge stack file
        return getEdgeStackFile(id);
      }

      // Fetch regular stack file
      const stackFile = await getStackFile(id);
      return stackFile?.StackFileContent;
    },
    {
      enabled: !!id,
      ...withGlobalError('Failed to load app stack file'),
    }
  );
}
