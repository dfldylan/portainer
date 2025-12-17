import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from './buildDockerProxyUrl';

export async function ping(environmentId: EnvironmentId) {
  try {
    await axios.get(buildDockerProxyUrl(environmentId, '_ping'));
  } catch (error) {
    throw parseAxiosError(error);
  }
}
