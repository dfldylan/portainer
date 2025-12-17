import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createContainerGroup } from '@CE/react/azure/services/container-groups.service';
import { queryKeys } from '@CE/react/azure/queries/query-keys';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import PortainerError from '@CE/portainer/error';
import {
  ContainerGroup,
  ContainerInstanceFormValues,
  ResourceGroup,
} from '@CE/react/azure/types';
import { applyResourceControl } from '@CE/react/portainer/access-control/access-control.service';

import { getSubscriptionResourceGroups } from './utils';

export function useCreateInstanceMutation(
  resourceGroups: {
    [k: string]: ResourceGroup[];
  },
  environmentId: EnvironmentId
) {
  const queryClient = useQueryClient();
  return useMutation<ContainerGroup, unknown, ContainerInstanceFormValues>(
    (values) => {
      if (!values.subscription) {
        throw new PortainerError('subscription is required');
      }

      const subscriptionResourceGroup = getSubscriptionResourceGroups(
        values.subscription,
        resourceGroups
      );
      const resourceGroup = subscriptionResourceGroup.find(
        (r) => r.value === values.resourceGroup
      );
      if (!resourceGroup) {
        throw new PortainerError('resource group not found');
      }

      return createContainerGroup(
        values,
        environmentId,
        values.subscription,
        resourceGroup.label
      );
    },
    {
      async onSuccess(containerGroup, values) {
        const resourceControl = containerGroup.Portainer?.ResourceControl;
        if (!resourceControl) {
          throw new PortainerError('resource control expected after creation');
        }

        const accessControlData = values.accessControl;
        await applyResourceControl(accessControlData, resourceControl.Id);
        return queryClient.invalidateQueries(
          queryKeys.subscriptions(environmentId)
        );
      },
    }
  );
}
