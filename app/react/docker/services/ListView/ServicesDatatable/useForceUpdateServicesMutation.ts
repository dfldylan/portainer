import { useMutation } from '@tanstack/react-query';

import { promiseSequence } from '@CE/portainer/helpers/promise-utils';
import { withError } from '@CE/react-tools/react-query';
import { forceUpdateService } from '@CE/react/portainer/environments/environment.service';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

export function useForceUpdateServicesMutation(environmentId: EnvironmentId) {
  return useMutation(
    ({ ids, pullImage }: { ids: Array<string>; pullImage: boolean }) =>
      promiseSequence(
        ids.map((id) => () => forceUpdateService(environmentId, id, pullImage))
      ),
    withError('Failed to remove services')
  );
}
