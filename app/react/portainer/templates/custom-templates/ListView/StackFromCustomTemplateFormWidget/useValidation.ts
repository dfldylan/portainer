import { useMemo } from 'react';
import { object, string } from 'yup';

import { accessControlFormValidation } from '@CE/react/portainer/access-control/AccessControlForm';
import { useNameValidation } from '@CE/react/common/stacks/CreateView/NameField';
import { variablesFieldValidation } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesField';
import { VariableDefinition } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesDefinitionField';
import { EnvironmentId } from '@CE/react/portainer/environments/types';

export function useValidation({
  environmentId,
  isAdmin,
  variableDefs,
  isDeployable,
}: {
  variableDefs: Array<VariableDefinition>;
  isAdmin: boolean;
  environmentId: EnvironmentId;
  isDeployable: boolean;
}) {
  const name = useNameValidation(environmentId);

  return useMemo(
    () =>
      object({
        name: name.test({
          name: 'is-deployable',
          message: 'This template cannot be deployed on this environment',
          test: () => isDeployable,
        }),
        accessControl: accessControlFormValidation(isAdmin),
        fileContent: string().required('Required'),
        variables: variablesFieldValidation(variableDefs),
      }),
    [isAdmin, isDeployable, name, variableDefs]
  );
}
