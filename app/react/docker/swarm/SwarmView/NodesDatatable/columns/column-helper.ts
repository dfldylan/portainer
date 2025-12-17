import { createColumnHelper } from '@tanstack/react-table';

import { NodeViewModel } from '@CE/docker/models/node';

export const columnHelper = createColumnHelper<NodeViewModel>();
