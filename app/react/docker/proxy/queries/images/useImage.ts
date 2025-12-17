import { ImageInspect } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param id
 * @returns
 */
export async function getImage(
  environmentId: EnvironmentId,
  id: Required<ImageInspect['Id']>
) {
  try {
    const { data } = await axios.get<ImageInspect>(
      buildDockerProxyUrl(environmentId, 'images', id, 'json')
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e, 'Unable to retrieve image');
  }
}
