import { mixed, number, object, string } from 'yup';
import { useMemo } from 'react';

import { StackType } from '@CE/react/common/stacks/types';
import { validation as commonFieldsValidation } from '@CE/react/portainer/custom-templates/components/CommonFields';
import { Platform } from '@CE/react/portainer/templates/types';
import { variablesValidation } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesDefinitionField';
import { buildGitValidationSchema } from '@CE/react/portainer/gitops/GitForm';
import { useGitCredentials } from '@CE/react/portainer/account/git-credentials/git-credentials.service';
import { useCurrentUser } from '@CE/react/hooks/useUser';
import { useCustomTemplates } from '@CE/react/portainer/templates/custom-templates/queries/useCustomTemplates';
import { edgeFieldsetValidation } from '@CE/react/portainer/templates/custom-templates/CreateView/EdgeSettingsFieldset.validation';
import { DeployMethod } from '@CE/react/portainer/gitops/types';

import { CustomTemplate } from '../types';
import { TemplateViewType } from '../useViewType';

export function useValidation({
  isGit,
  templateId,
  viewType,
  deployMethod,
}: {
  isGit: boolean;
  templateId: CustomTemplate['Id'];
  viewType: TemplateViewType;
  deployMethod: DeployMethod;
}) {
  const { user } = useCurrentUser();
  const gitCredentialsQuery = useGitCredentials(user.Id);
  const customTemplatesQuery = useCustomTemplates({
    params: {
      edge: undefined,
    },
  });

  return useMemo(
    () =>
      object({
        Platform: number()
          .oneOf([Platform.LINUX, Platform.WINDOWS])
          .default(Platform.LINUX),
        Type: number()
          .oneOf([
            StackType.DockerCompose,
            StackType.DockerSwarm,
            StackType.Kubernetes,
          ])
          .default(StackType.DockerCompose),
        FileContent: string().required('Template is required.'),

        Git: isGit
          ? buildGitValidationSchema(
              gitCredentialsQuery.data || [],
              false,
              deployMethod
            )
          : mixed(),
        Variables: variablesValidation(),
        EdgeSettings: viewType === 'edge' ? edgeFieldsetValidation() : mixed(),
      }).concat(
        commonFieldsValidation({
          templates: customTemplatesQuery.data,
          currentTemplateId: templateId,
        })
      ),
    [
      customTemplatesQuery.data,
      gitCredentialsQuery.data,
      isGit,
      templateId,
      viewType,
      deployMethod,
    ]
  );
}
