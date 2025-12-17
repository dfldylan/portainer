import { User as UserIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useUsers } from '@CE/portainer/users/queries';
import { AuthenticationMethod } from '@CE/react/portainer/settings/types';
import { useSettings } from '@CE/react/portainer/settings/queries';
import { notifySuccess } from '@CE/portainer/services/notifications';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@CE/react-tools/react-query';
import { processItemsInBatches } from '@CE/react/common/processItemsInBatches';
import { useCurrentUser } from '@CE/react/hooks/useUser';

import { Datatable } from '@@CE/datatables';
import { useTableState } from '@@CE/datatables/useTableState';
import { createPersistedStore } from '@@CE/datatables/types';
import { DeleteButton } from '@@CE/buttons/DeleteButton';

import { useTeamMemberships } from '../../teams/queries/useTeamMemberships';
import { TeamId, TeamRole } from '../../teams/types';
import { deleteUser } from '../../queries/useDeleteUserMutation';

import { columns } from './columns';
import { DecoratedUser } from './types';

const store = createPersistedStore('users');

export function UsersDatatable() {
  const { handleRemove } = useRemoveMutation();
  const { isPureAdmin } = useCurrentUser();
  const usersQuery = useUsers(isPureAdmin);
  const membershipsQuery = useTeamMemberships();
  const settingsQuery = useSettings();
  const tableState = useTableState(store, 'users');

  const dataset: Array<DecoratedUser> | null = useMemo(() => {
    if (!usersQuery.data || !membershipsQuery.data || !settingsQuery.data) {
      return null;
    }

    const memberships = membershipsQuery.data;

    return usersQuery.data.map((user) => {
      const teamMembership = memberships.find(
        (membership) => membership.UserID === user.Id
      );

      return {
        ...user,
        isTeamLeader: teamMembership?.Role === TeamRole.Leader,
        authMethod:
          AuthenticationMethod[
            user.Id === 1
              ? AuthenticationMethod.Internal
              : settingsQuery.data.AuthenticationMethod
          ],
      };
    });
  }, [membershipsQuery.data, settingsQuery.data, usersQuery.data]);

  return (
    <Datatable
      columns={columns}
      dataset={dataset || []}
      isLoading={!dataset}
      title="Users"
      titleIcon={UserIcon}
      settingsManager={tableState}
      isRowSelectable={(row) => row.original.Id !== 1}
      renderTableActions={(selectedItems) => (
        <DeleteButton
          disabled={selectedItems.length === 0}
          confirmMessage="Do you want to remove the selected users? They will not be able to login into Portainer anymore."
          onConfirmed={() => handleRemove(selectedItems.map((i) => i.Id))}
          data-cy="remove-users-button"
        />
      )}
      data-cy="users-datatable"
    />
  );
}

function useRemoveMutation() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    async (ids: TeamId[]) => processItemsInBatches(ids, deleteUser),
    mutationOptions(
      withError('Unable to remove users'),
      withInvalidate(queryClient, [['users']])
    )
  );

  return { handleRemove };

  async function handleRemove(teams: TeamId[]) {
    deleteMutation.mutate(teams, {
      onSuccess: () => {
        notifySuccess('Teams successfully removed', '');
      },
    });
  }
}
