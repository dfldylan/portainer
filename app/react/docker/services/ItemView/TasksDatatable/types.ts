import { TaskViewModel } from '@CE/docker/models/task';
import { ContainerListViewModel } from '@CE/react/docker/containers/types';

export type DecoratedTask = TaskViewModel & {
  Container?: ContainerListViewModel;
};
