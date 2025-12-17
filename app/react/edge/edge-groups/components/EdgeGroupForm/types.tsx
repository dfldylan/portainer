import {
  EdgeGroupId,
  EnvironmentId,
} from '@CE/react/portainer/environments/types';
import { TagId } from '@CE/portainer/tags/types';

export interface FormValues {
  edgeGroupId: EdgeGroupId;
  name: string;
  dynamic: boolean;
  environmentIds: EnvironmentId[];
  partialMatch: boolean;
  tagIds: TagId[];
}
