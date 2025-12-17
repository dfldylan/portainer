import { List } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { Authorized, useAuthorizations } from '@CE/react/hooks/useUser';
import { SystemResourceDescription } from '@CE/react/kubernetes/datatables/SystemResourceDescription';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { isSystemNamespace } from '@CE/react/kubernetes/namespaces/queries/useIsSystemNamespace';
import { useNamespacesQuery } from '@CE/react/kubernetes/namespaces/queries/useNamespacesQuery';
import { DefaultDatatableSettings } from '@CE/react/kubernetes/datatables/DefaultDatatableSettings';
import { useIngresses } from '@CE/react/kubernetes/ingresses/queries';

import { ExpandableDatatable } from '@@CE/datatables/ExpandableDatatable';
import { TableSettingsMenu } from '@@CE/datatables';
import { DeleteButton } from '@@CE/buttons/DeleteButton';

import { useApplications } from '../../queries/useApplications';
import { ApplicationsTableSettings } from '../useKubeAppsTableStore';
import { useDeleteApplicationsMutation } from '../../queries/useDeleteApplicationsMutation';

import { columns } from './columns';
import { SubRows } from './SubRows';
import { NamespaceFilter } from './NamespaceFilter';
import { getStacksFromApplications } from './getStacksFromApplications';
import { Stack } from './types';

export function ApplicationsStacksDatatable({
  tableState,
}: {
  tableState: ApplicationsTableSettings & {
    setSearch: (value: string) => void;
    search: string;
  };
}) {
  const router = useRouter();
  const environmentId = useEnvironmentId();
  const namespaceListQuery = useNamespacesQuery(environmentId);
  const { authorized: hasWriteAuth } = useAuthorizations('K8sApplicationsW');
  const applicationsQuery = useApplications(environmentId, {
    refetchInterval: tableState.autoRefreshRate * 1000,
    namespace: tableState.namespace,
  });
  const ingressesQuery = useIngresses(environmentId);
  const ingresses = ingressesQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const filteredApplications = tableState.showSystemResources
    ? applications
    : applications.filter(
        (item) =>
          !isSystemNamespace(item.ResourcePool, namespaceListQuery.data ?? [])
      );
  const stacks = getStacksFromApplications(filteredApplications);
  const removeApplicationsMutation = useDeleteApplicationsMutation({
    environmentId,
    stacks,
    ingresses,
    reportStacks: true,
  });

  return (
    <ExpandableDatatable
      getRowCanExpand={(row) => row.original.Applications.length > 0}
      title="Stacks"
      titleIcon={List}
      dataset={stacks}
      isLoading={applicationsQuery.isLoading || namespaceListQuery.isLoading}
      columns={columns}
      settingsManager={tableState}
      disableSelect={!hasWriteAuth}
      renderSubRow={(row) => (
        <SubRows stack={row.original} span={row.getVisibleCells().length} />
      )}
      description={
        <div className="w-full">
          <div className="float-right mr-2 min-w-[140px]">
            <NamespaceFilter
              namespaces={namespaceListQuery.data ?? []}
              value={tableState.namespace}
              onChange={tableState.setNamespace}
              showSystem={tableState.showSystemResources}
            />
          </div>

          <div className="space-y-2">
            <SystemResourceDescription
              showSystemResources={tableState.showSystemResources}
            />
          </div>
        </div>
      }
      renderTableActions={(selectedItems) => (
        <Authorized authorizations="K8sApplicationsW">
          <DeleteButton
            confirmMessage="Are you sure that you want to remove the selected stack(s) ? This will remove all the applications associated to the stack(s)."
            disabled={selectedItems.length === 0}
            onConfirmed={() => handleRemoveStacks(selectedItems)}
            data-cy="k8sApp-removeStackButton"
          />
        </Authorized>
      )}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <DefaultDatatableSettings settings={tableState} />
        </TableSettingsMenu>
      )}
      getRowId={(row) => `${row.Name}-${row.ResourcePool}`}
      data-cy="applications-stacks-datatable"
    />
  );

  function handleRemoveStacks(selectedItems: Stack[]) {
    const applications = selectedItems.flatMap((stack) => stack.Applications);
    removeApplicationsMutation.mutate(applications, {
      onSuccess: () => {
        router.stateService.reload();
      },
    });
  }
}
