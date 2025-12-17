import { useMutation } from '@tanstack/react-query';

import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { createVolume } from '@CE/react/docker/volumes/queries/useCreateVolume';

export function useCreateLocalVolumes() {
  const environmentId = useEnvironmentId();

  return useMutation(async (count: number) =>
    Promise.all(
      Array.from({ length: count }).map(() =>
        createVolume(environmentId, { Driver: 'local' })
      )
    )
  );
}
