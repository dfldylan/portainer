import { createColumnHelper } from '@tanstack/react-table';

import { ServiceViewModel } from '@CE/docker/models/service';

export const columnHelper = createColumnHelper<ServiceViewModel>();
