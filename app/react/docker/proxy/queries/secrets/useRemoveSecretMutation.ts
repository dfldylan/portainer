import { Secret } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

export async function removeSecret(
  environmentId: EnvironmentId,
  id: NonNullable<Secret['ID']>
) {
  try {
    await axios.delete(buildDockerProxyUrl(environmentId, 'secrets', id));
  } catch (err) {
    throw parseAxiosError(err, 'Unable to remove secret');
  }
}
