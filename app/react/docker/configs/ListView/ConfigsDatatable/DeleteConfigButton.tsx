import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { promiseSequence } from '@CE/portainer/helpers/promise-utils';
import { withGlobalError, withInvalidate } from '@CE/react-tools/react-query';
import { EnvironmentId } from '@CE/react/portainer/environments/types';
import { notifySuccess } from '@CE/portainer/services/notifications';
import { pluralize } from '@CE/portainer/helpers/strings';

import { DeleteButton } from '@@CE/buttons/DeleteButton';

import { ConfigViewModel } from '../../model';
import { queryKeys } from '../../queries/query-keys';
import { deleteConfig } from '../../queries/useDeleteConfigMutation';

export function DeleteConfigButton({
  selectedItems,
}: {
  selectedItems: Array<ConfigViewModel>;
}) {
  const environmentId = useEnvironmentId();
  const mutation = useDeleteConfigListMutation(environmentId);

  return (
    <DeleteButton
      data-cy="remove-docker-configs-button"
      onConfirmed={() => {
        mutation.mutate(
          selectedItems.map((item) => item.Id),
          {
            onSuccess() {
              notifySuccess(
                `${pluralize(
                  selectedItems.length,
                  'Config'
                )} successfully removed`,
                // log the item name if it's only one config
                selectedItems.length === 1 ? selectedItems[0].Name : ''
              );
            },
          }
        );
      }}
      confirmMessage="Do you want to remove the selected config(s)?"
      disabled={selectedItems.length === 0}
    />
  );
}

function useDeleteConfigListMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: Array<string>) =>
      promiseSequence(
        ids.map((configId) => () => deleteConfig({ environmentId, configId }))
      ),
    ...withGlobalError('Unable to remove configs'),
    ...withInvalidate(queryClient, [queryKeys.base(environmentId)]),
  });
}
