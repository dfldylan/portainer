import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import {
  mutationOptions,
  withGlobalError,
  withInvalidate,
} from '@CE/react-tools/react-query';

import { TeamId } from '../types';

import { buildUrl } from './build-url';

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: TeamId) => deleteTeam(id),

    mutationOptions(
      withGlobalError('Unable to delete team'),
      withInvalidate(queryClient, [['teams']])
    )
  );
}

export async function deleteTeam(id: TeamId) {
  try {
    await axios.delete(buildUrl(id));
  } catch (error) {
    throw parseAxiosError(error as Error);
  }
}
