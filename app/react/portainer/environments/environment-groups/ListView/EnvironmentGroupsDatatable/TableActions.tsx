import { notifySuccess } from '@CE/portainer/services/notifications';

import { DeleteButton } from '@@CE/buttons/DeleteButton';
import { AddButton } from '@@CE/buttons';

import { EnvironmentGroup } from '../../types';

import { useDeleteEnvironmentGroupsMutation } from './useDeleteEnvironmentGroupsMutation';

export function TableActions({
  selectedItems,
}: {
  selectedItems: EnvironmentGroup[];
}) {
  const deleteMutation = useDeleteEnvironmentGroupsMutation();

  return (
    <>
      <DeleteButton
        disabled={selectedItems.length === 0}
        confirmMessage="Are you sure you want to remove the selected environment group(s)?"
        onConfirmed={handleRemove}
        data-cy="remove-environment-groups-button"
      />

      <AddButton data-cy="add-environment-group-button">Add group</AddButton>
    </>
  );

  function handleRemove() {
    const ids = selectedItems.map((item) => item.Id);
    deleteMutation.mutate(ids, {
      onSuccess() {
        notifySuccess('Success', 'Environment Group(s) removed');
      },
    });
  }
}
