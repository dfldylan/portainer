import { ResourceControlResponse } from '@/react/portainer/access-control/types';
import { AuthTypeOption } from '@/react/portainer/account/git-credentials/types';
import {
  AutoUpdateResponse,
  RepoConfigResponse,
} from '@/react/portainer/gitops/types';

import { EnvVar } from '@@/form-components/EnvironmentVariablesFieldset/types';

export type StackId = number;

export enum StackType {
  /**
   * Represents a stack managed via docker stack
   */
  DockerSwarm = 1,
  /**
   * Represents a stack managed via docker-compose
   */
  DockerCompose,
  /**
   * Represents a stack managed via kubectl
   */
  Kubernetes,
}

export enum StackStatus {
  Active = 1,
  Inactive,
}

export interface Stack {
  Id: number;
  Name: string;
  Type: StackType;
  EndpointId: number;
  SwarmId: string;
  EntryPoint: string;
  Env: EnvVar[];
  ResourceControl?: ResourceControlResponse;
  Status: StackStatus;
  ProjectPath: string;
  CreationDate: number;
  CreatedBy: string;
  UpdateDate: number;
  UpdatedBy: string;
  AdditionalFiles?: string[];
  AutoUpdate?: AutoUpdateResponse;
  Option?: {
    Prune: boolean;
    Force: boolean;
  };
  GitConfig?: RepoConfigResponse;
  FromAppTemplate: boolean;
  Namespace?: string;
  IsComposeFormat: boolean;
  Webhook?: string;
  SupportRelativePath: boolean;
  FilesystemPath: string;
  StackFileVersion: string;
  PreviousDeploymentInfo: unknown;
}

export type StackFile = {
  StackFileContent: string;
};

export interface GitStackPayload {
  env: Array<EnvVar>;
  prune?: boolean;
  RepositoryReferenceName?: string;
  RepositoryAuthentication?: boolean;
  RepositoryGitCredentialID?: number;
  RepositoryUsername?: string;
  RepositoryPassword?: string;
  RepositoryAuthorizationType?: AuthTypeOption;
  PullImage?: boolean;
  AutoUpdate?: AutoUpdateResponse | null;
  TLSSkipVerify?: boolean;
  Registries?: number[];
  HelmChartPath?: string;
  HelmValuesFiles?: string[];
  Atomic?: boolean;
}
