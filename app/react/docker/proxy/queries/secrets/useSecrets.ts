import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

export async function getSecrets(environmentId: EnvironmentId) {
  try {
    const { data } = await axios.get(
      buildDockerProxyUrl(environmentId, 'secrets')
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, 'Unable to retrieve secrets');
  }
}
