import { TeamId } from '@CE/react/portainer/users/teams/types';

import { createRowContext } from '@@CE/datatables/RowContext';

interface RowContext {
  disabled?: boolean;
  teamId: TeamId;
}

const { RowProvider, useRowContext } = createRowContext<RowContext>();

export { RowProvider, useRowContext };
