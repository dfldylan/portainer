import { convertToArrayOfStrings } from '@@CE/form-components/EnvironmentVariablesFieldset/utils';
import { EnvVarValues } from '@@CE/form-components/EnvironmentVariablesFieldset';

import { CreateContainerRequest } from '../types';

export function toRequest(
  oldConfig: CreateContainerRequest,
  values: EnvVarValues
): CreateContainerRequest {
  return {
    ...oldConfig,
    Env: convertToArrayOfStrings(values),
  };
}
