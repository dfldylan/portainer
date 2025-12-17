import { createColumnHelper } from '@tanstack/react-table';

import { ImagesListResponse } from '@CE/react/docker/images/queries/useImages';

export const columnHelper = createColumnHelper<ImagesListResponse>();
