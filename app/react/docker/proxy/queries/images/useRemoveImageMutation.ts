import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { ImageId, ImageName } from '@CE/docker/models/image';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param id
 * @param force
 * @returns
 */
export async function removeImage(
  environmentId: EnvironmentId,
  id: ImageId | ImageName,
  force?: boolean
) {
  try {
    const { data } = await axios.delete(
      buildDockerProxyUrl(environmentId, 'images', id),
      { params: { force } }
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to remove image');
  }
}
