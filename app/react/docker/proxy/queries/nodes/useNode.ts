import { Node } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param id
 * @returns
 */
export async function getNode(
  environmentId: EnvironmentId,
  id: NonNullable<Node['ID']>
) {
  try {
    const { data } = await axios.get<Node>(
      buildDockerProxyUrl(environmentId, 'nodes', id)
    );
    return data;
  } catch (error) {
    throw parseAxiosError(error, 'Unable to retrieve node');
  }
}
