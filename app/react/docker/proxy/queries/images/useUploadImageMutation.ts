import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param file
 * @returns
 */
export async function uploadImages(environmentId: EnvironmentId, file: File) {
  try {
    return await axios.post(
      buildDockerProxyUrl(environmentId, 'images', 'load'),
      file,
      {
        headers: {
          'Content-Type': file.type, // 'application/x-tar',
        },
      }
    );
  } catch (e) {
    throw parseAxiosError(e, 'Unable to upload image');
  }
}
