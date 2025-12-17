import { CellContext } from '@tanstack/react-table';

import { ImageUpToDateTooltip } from '@CE/react/docker/components/datatable/TableColumnHeaderImageUpToDate';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { isRegularStack } from '@CE/react/docker/stacks/view-models/utils';

import { DecoratedStack } from '../types';

import { StackImageStatus } from './StackImageStatus';
import { columnHelper } from './helper';

export const imageNotificationColumn = columnHelper.display({
  id: 'imageNotification',
  enableHiding: false,
  header: () => (
    <>
      Images up to date
      <ImageUpToDateTooltip />
    </>
  ),
  cell: Cell,
});

function Cell({
  row: { original: item },
}: CellContext<DecoratedStack, unknown>) {
  const environmentId = useEnvironmentId();

  if (!isRegularStack(item)) {
    return null;
  }

  return <StackImageStatus environmentId={environmentId} stackId={item.Id} />;
}
