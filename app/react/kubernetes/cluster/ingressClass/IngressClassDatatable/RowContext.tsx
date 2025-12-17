import { Environment } from '@CE/react/portainer/environments/types';

import { createRowContext } from '@@CE/datatables/RowContext';

interface RowContextState {
  environment: Environment;
}

const { RowProvider, useRowContext } = createRowContext<RowContextState>();

export { RowProvider, useRowContext };
