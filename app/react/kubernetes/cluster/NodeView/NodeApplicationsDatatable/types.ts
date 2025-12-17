import { KubernetesApplication } from '@CE/kubernetes/models/application/models';

export type NodeApplication = KubernetesApplication & {
  CPU: number;
  Memory: number;
};
