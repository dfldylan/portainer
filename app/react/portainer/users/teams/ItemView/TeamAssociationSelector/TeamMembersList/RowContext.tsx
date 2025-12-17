import { TeamRole, TeamId } from '@CE/react/portainer/users/teams/types';
import { UserId } from '@CE/portainer/users/types';

import { createRowContext } from '@@CE/datatables/RowContext';

export interface RowContext {
  getRole(userId: UserId): TeamRole;
  disabled?: boolean;
  teamId: TeamId;
}

const { RowProvider, useRowContext } = createRowContext<RowContext>();

export { RowProvider, useRowContext };
