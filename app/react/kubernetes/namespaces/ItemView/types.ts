import { KubernetesApplication } from '@CE/kubernetes/models/application/models';

export interface NamespaceApp extends KubernetesApplication {
  CPU: number;
  Memory: number;
}
