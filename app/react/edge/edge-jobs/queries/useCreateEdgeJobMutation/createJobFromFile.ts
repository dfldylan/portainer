import axios, {
  json2formData,
  parseAxiosError,
} from '@CE/portainer/services/axios';
import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

import { EdgeJob } from '../../types';
import { buildUrl } from '../build-url';

/**
 * Payload to create an EdgeJob from a file
 */
export type FileUploadPayload = {
  Name: string;
  CronExpression: string;
  Recurring: boolean;

  EdgeGroups: Array<EdgeGroup['Id']>;
  Endpoints: Array<EnvironmentId>;
  File: File;
};

export async function createJobFromFile(payload: FileUploadPayload) {
  try {
    const { data } = await axios.post<EdgeJob>(
      buildUrl({ action: 'create/file' }),
      json2formData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error);
  }
}
