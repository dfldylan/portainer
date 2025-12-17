import { object, string } from 'yup';
import { useMemo } from 'react';

import { accessControlFormValidation } from '@CE/react/portainer/access-control/AccessControlForm';
import { hostnameSchema } from '@CE/react/docker/containers/CreateView/NetworkTab/HostnameField';
import { hostFileSchema } from '@CE/react/docker/containers/CreateView/NetworkTab/HostsFileEntries';
import { labelsTabUtils } from '@CE/react/docker/containers/CreateView/LabelsTab';
import { nameValidation } from '@CE/react/docker/containers/CreateView/BaseForm/NameField';
import { validationSchema as portSchema } from '@CE/react/docker/containers/CreateView/BaseForm/PortsMappingField.validation';
import { volumesTabUtils } from '@CE/react/docker/containers/CreateView/VolumesTab';

import { envVarsFieldsetValidation } from '../EnvVarsFieldset';
import { TemplateEnv } from '../../types';

export function useValidation({
  isAdmin,
  envVarDefinitions,
}: {
  isAdmin: boolean;
  envVarDefinitions: Array<TemplateEnv>;
}) {
  return useMemo(
    () =>
      object({
        accessControl: accessControlFormValidation(isAdmin),
        envVars: envVarsFieldsetValidation(envVarDefinitions),
        hostname: hostnameSchema,
        hosts: hostFileSchema,
        labels: labelsTabUtils.validation(),
        name: nameValidation(),
        network: string().default(''),
        ports: portSchema(),
        volumes: volumesTabUtils.validation(),
      }),
    [envVarDefinitions, isAdmin]
  );
}
