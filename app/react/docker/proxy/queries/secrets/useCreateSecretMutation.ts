import { SecretSpec } from 'docker-types/generated/1.44';

import axios, { parseAxiosError } from '@CE/portainer/services/axios';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { buildDockerProxyUrl } from '../buildDockerProxyUrl';

export async function createSecret(
  environmentId: EnvironmentId,
  secret: SecretSpec
) {
  try {
    const { data } = await axios.post(
      buildDockerProxyUrl(environmentId, 'secrets', 'create'),
      secret
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, 'Unable to create secret');
  }
}
