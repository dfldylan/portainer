import { Environment } from '@CE/react/portainer/environments/types';
import { Registry } from '@CE/react/portainer/registries/types/registry';

enum WebhookType {
  Service = 1,
  Container = 2,
}

export interface Webhook {
  Id: string;
  Token: string;
  ResourceId: string;
  EndpointId: Environment['Id'];
  RegistryId: Registry['Id'];
  Type: WebhookType;
}
