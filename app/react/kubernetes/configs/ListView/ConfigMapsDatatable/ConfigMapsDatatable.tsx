import { useMemo } from 'react';
import { FileCode } from 'lucide-react';

import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { Authorized, useAuthorizations } from '@CE/react/hooks/useUser';
import { DefaultDatatableSettings } from '@CE/react/kubernetes/datatables/DefaultDatatableSettings';
import { createStore } from '@CE/react/kubernetes/datatables/default-kube-datatable-store';
import { SystemResourceDescription } from '@CE/react/kubernetes/datatables/SystemResourceDescription';
import { useIsDeploymentOptionHidden } from '@CE/react/hooks/useIsDeploymentOptionHidden';
import { pluralize } from '@CE/portainer/helpers/strings';
import { useNamespacesQuery } from '@CE/react/kubernetes/namespaces/queries/useNamespacesQuery';
import { PortainerNamespace } from '@CE/react/kubernetes/namespaces/types';
import { CreateFromManifestButton } from '@CE/react/kubernetes/components/CreateFromManifestButton';
import { isSystemNamespace } from '@CE/react/kubernetes/namespaces/queries/useIsSystemNamespace';

import { Datatable, TableSettingsMenu } from '@@CE/datatables';
import { AddButton } from '@@CE/buttons';
import { useTableState } from '@@CE/datatables/useTableState';
import { DeleteButton } from '@@CE/buttons/DeleteButton';

import { IndexOptional, Configuration } from '../../types';
import { useDeleteConfigMaps } from '../../queries/useDeleteConfigMaps';
import { useConfigMapsForCluster } from '../../queries/useConfigmapsForCluster';

import { ConfigMapRowData } from './types';
import { columns } from './columns';

const storageKey = 'k8sConfigMapsDatatable';
const settingsStore = createStore(storageKey);

export function ConfigMapsDatatable() {
  const tableState = useTableState(settingsStore, storageKey);
  const { authorized: canWrite } = useAuthorizations(['K8sConfigMapsW']);
  const readOnly = !canWrite;
  const { authorized: canAccessSystemResources } = useAuthorizations(
    'K8sAccessSystemNamespaces'
  );

  const environmentId = useEnvironmentId();
  const namespacesQuery = useNamespacesQuery(environmentId, {
    autoRefreshRate: tableState.autoRefreshRate * 1000,
  });
  const configMapsQuery = useConfigMapsForCluster(environmentId, {
    autoRefreshRate: tableState.autoRefreshRate * 1000,
    select: (configMaps) =>
      configMaps.filter(
        (configmap) =>
          (canAccessSystemResources && tableState.showSystemResources) ||
          !isSystemNamespace(configmap.Namespace, namespacesQuery.data)
      ),
    isUsed: true,
  });

  const configMapRowData = useConfigMapRowData(
    configMapsQuery.data ?? [],
    namespacesQuery.data
  );

  return (
    <Datatable<IndexOptional<ConfigMapRowData>>
      dataset={configMapRowData}
      columns={columns}
      settingsManager={tableState}
      isLoading={configMapsQuery.isLoading || namespacesQuery.isLoading}
      emptyContentLabel="No ConfigMaps found"
      title="ConfigMaps"
      titleIcon={FileCode}
      getRowId={(row) => row.UID ?? ''}
      isRowSelectable={({ original: configmap }) =>
        !isSystemNamespace(configmap.Namespace, namespacesQuery.data)
      }
      disableSelect={readOnly}
      renderTableActions={(selectedRows) => (
        <TableActions selectedItems={selectedRows} />
      )}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <DefaultDatatableSettings settings={tableState} />
        </TableSettingsMenu>
      )}
      description={
        <SystemResourceDescription
          showSystemResources={tableState.showSystemResources}
        />
      }
      data-cy="k8s-configmaps-datatable"
    />
  );
}

function useConfigMapRowData(
  configMaps: Configuration[],
  namespaces?: PortainerNamespace[]
): ConfigMapRowData[] {
  return useMemo(
    () =>
      configMaps?.map((configMap) => ({
        ...configMap,
        inUse: configMap.IsUsed,
        isSystem: namespaces
          ? namespaces.find(
              (namespace) => namespace.Name === configMap.Namespace
            )?.IsSystem ?? false
          : false,
      })) || [],
    [configMaps, namespaces]
  );
}

function TableActions({
  selectedItems,
}: {
  selectedItems: ConfigMapRowData[];
}) {
  const isAddConfigMapHidden = useIsDeploymentOptionHidden('form');
  const environmentId = useEnvironmentId();
  const deleteConfigMapMutation = useDeleteConfigMaps(environmentId);

  return (
    <Authorized authorizations="K8sConfigMapsW">
      <DeleteButton
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemoveClick(selectedItems)}
        confirmMessage={`Are you sure you want to remove the selected ${pluralize(
          selectedItems.length,
          'ConfigMap'
        )}`}
        data-cy="k8sConfig-removeConfigButton"
      />

      {!isAddConfigMapHidden && (
        <AddButton
          to="kubernetes.configmaps.new"
          data-cy="k8sConfig-addConfigWithFormButton"
          color="secondary"
        >
          Add with form
        </AddButton>
      )}

      <CreateFromManifestButton
        params={{
          tab: 'configmaps',
        }}
        data-cy="k8sConfig-deployFromManifestButton"
      />
    </Authorized>
  );

  async function handleRemoveClick(configMaps: ConfigMapRowData[]) {
    const configMapsToDelete = configMaps.map((configMap) => ({
      namespace: configMap.Namespace ?? '',
      name: configMap.Name ?? '',
    }));

    await deleteConfigMapMutation.mutateAsync(configMapsToDelete);
  }
}
