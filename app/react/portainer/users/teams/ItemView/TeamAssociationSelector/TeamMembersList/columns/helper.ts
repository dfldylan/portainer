import { createColumnHelper } from '@tanstack/react-table';

import { User } from '@CE/portainer/users/types';

export const columnHelper = createColumnHelper<User>();
