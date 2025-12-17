import { CellContext } from '@tanstack/react-table';

import { ImagesListResponse } from '@CE/react/docker/images/queries/useImages';

import { Badge } from '@@CE/Badge';

import { columnHelper } from './helper';

export const tags = columnHelper.accessor((item) => item.tags?.join(','), {
  id: 'tags',
  header: 'Tags',
  cell: Cell,
});

function Cell({
  row: { original: item },
}: CellContext<ImagesListResponse, unknown>) {
  const repoTags = item.tags;

  return (
    <div className="flex flex-wrap gap-1">
      {repoTags?.map((tag, idx) => (
        <Badge key={idx} type="info">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
