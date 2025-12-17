import { createColumnHelper } from '@tanstack/react-table';

import { Application } from '@CE/react/kubernetes/applications/ListView/ApplicationsDatatable/types';

export const helper = createColumnHelper<Application>();
