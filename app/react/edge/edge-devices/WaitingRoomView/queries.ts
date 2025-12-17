import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  EdgeTypes,
  EnvironmentId,
} from '@CE/react/portainer/environments/types';
import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { promiseSequence } from '@CE/portainer/helpers/promise-utils';
import { useIntegratedLicenseInfo } from '@CE/react/portainer/licenses/use-license.service';
import { useEnvironmentList } from '@CE/react/portainer/environments/queries';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { queryKey as nodesCountQueryKey } from '@CE/react/portainer/system/useNodesCount';
import { LicenseType } from '@CE/react/portainer/licenses/types';
import { environmentQueryKeys } from '@CE/react/portainer/environments/queries/query-keys';

export function useAssociateDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: EnvironmentId[]) =>
      promiseSequence(ids.map((id) => () => associateDevice(id))),
    mutationOptions(
      withError('Failed to associate devices'),
      withInvalidate(queryClient, [
        environmentQueryKeys.base(),
        nodesCountQueryKey,
      ])
    )
  );
}

async function associateDevice(environmentId: EnvironmentId) {
  try {
    await axios.post(`/endpoints/${environmentId}/edge/trust`);
  } catch (e) {
    throw parseAxiosError(e as Error, 'Failed to associate device');
  }
}

export function useLicenseOverused(moreNodes: number) {
  const integratedInfo = useIntegratedLicenseInfo();

  return (
    !!integratedInfo &&
    integratedInfo.licenseInfo.type === LicenseType.Essentials &&
    integratedInfo.usedNodes + moreNodes > integratedInfo.licenseInfo.nodes
  );
}

export function useUntrustedCount() {
  const query = useEnvironmentList({
    edgeDeviceUntrusted: true,
    types: EdgeTypes,
  });
  return query.totalCount;
}
