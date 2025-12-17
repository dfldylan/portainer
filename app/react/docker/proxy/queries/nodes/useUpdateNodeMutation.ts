import { Node, NodeSpec } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

/**
 * Raw docker API proxy
 * @param environmentId
 * @param id
 * @param node
 * @param version
 */
export async function updateNode(
  environmentId: EnvironmentId,
  id: NonNullable<Node['ID']>,
  node: NodeSpec,
  version: number
) {
  try {
    const { data } = await axios.post(
      buildDockerProxyUrl(environmentId, 'nodes', id, 'update'),
      node,
      { params: { version } }
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, 'Unable to update node');
  }
}
