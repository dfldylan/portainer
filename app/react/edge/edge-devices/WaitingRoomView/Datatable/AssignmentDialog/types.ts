import { TagId } from '@CE/portainer/tags/types';
import { EdgeGroup } from '@CE/react/edge/edge-groups/types';
import { EnvironmentGroupId } from '@CE/react/portainer/environments/types';

export interface FormValues {
  group: EnvironmentGroupId | null;
  overrideGroup: boolean;
  edgeGroups: Array<EdgeGroup['Id']>;
  overrideEdgeGroups: boolean;
  tags: Array<TagId>;
  overrideTags: boolean;
}
