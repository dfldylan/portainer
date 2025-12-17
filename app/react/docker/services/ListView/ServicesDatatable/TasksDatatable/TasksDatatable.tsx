import { DecoratedTask } from '@CE/react/docker/services/ItemView/TasksDatatable/types';
import { status } from '@CE/react/docker/services/ItemView/TasksDatatable/columns/status';
import { actions } from '@CE/react/docker/services/ItemView/TasksDatatable/columns/actions';
import { slot } from '@CE/react/docker/services/ItemView/TasksDatatable/columns/slot';
import { node } from '@CE/react/docker/services/ItemView/TasksDatatable/columns/node';
import { updated } from '@CE/react/docker/services/ItemView/TasksDatatable/columns/updated';

import { NestedDatatable } from '@@CE/datatables/NestedDatatable';

import { task } from './task-column';

const columns = [status, task, actions, slot, node, updated];

export function TasksDatatable({
  dataset,
  search,
}: {
  dataset: DecoratedTask[];
  search?: string;
}) {
  return (
    <NestedDatatable
      columns={columns}
      dataset={dataset}
      search={search}
      aria-label="Tasks table"
      data-cy="docker-service-tasks-nested-datatable"
    />
  );
}
