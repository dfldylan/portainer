import {
  EnvironmentId,
  EnvironmentType,
} from '@CE/react/portainer/environments/types';
import { TagId } from '@CE/portainer/tags/types';

export interface EdgeGroup {
  Id: number;
  Name: string;
  Dynamic: boolean;
  TagIds: TagId[];
  Endpoints: EnvironmentId[];
  PartialMatch: boolean;
  EndpointTypes: EnvironmentType[];
}
