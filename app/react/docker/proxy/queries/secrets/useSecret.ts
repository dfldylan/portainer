import { Secret } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { PortainerResponse } from '@CE/react/docker/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

export async function getSecret(
  environmentId: EnvironmentId,
  id: NonNullable<Secret['ID']>
) {
  try {
    const { data } = await axios.get<PortainerResponse<Secret>>(
      buildDockerProxyUrl(environmentId, 'secrets', id)
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, 'Unable to retrieve secret');
  }
}
