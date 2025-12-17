import { TagIcon } from 'lucide-react';
import { useStore } from 'zustand';

import { Datatable } from '@@CE/datatables';
import { useTableStateWithStorage } from '@@CE/datatables/useTableState';
import { DeleteButton } from '@@CE/buttons/DeleteButton';
import { withMeta } from '@@CE/datatables/extend-options/withMeta';
import { mergeOptions } from '@@CE/datatables/extend-options/mergeOptions';

import { Tag } from './types';
import { useColumns } from './columns/useColumns';
import { newNamesStore } from './useRetagState';
import { RepositoryTagViewModel } from './view-model';

export function TagsDatatable({
  dataset,
  advancedFeaturesAvailable,
  onRemove,
  onRetag,
}: {
  dataset?: Tag[];
  advancedFeaturesAvailable: boolean;
  onRemove: (tags: Tag[]) => void;
  onRetag: (tags: Record<string, RepositoryTagViewModel>) => Promise<void>;
}) {
  const updatesState = useStore(newNamesStore);

  const tableState = useTableStateWithStorage('registryRepositoryTags', 'name');
  const columns = useColumns(advancedFeaturesAvailable);

  return (
    <Datatable
      title="Tags"
      titleIcon={TagIcon}
      columns={columns}
      dataset={dataset || []}
      isLoading={!dataset}
      settingsManager={tableState}
      renderTableActions={(selectedItems) =>
        advancedFeaturesAvailable && (
          <DeleteButton
            confirmMessage="Are you sure you want to remove the selected tags?"
            onConfirmed={() => onRemove(selectedItems)}
            data-cy="remove-registry-tags-button"
          />
        )
      }
      getRowId={(tag) => tag.Name}
      extendTableOptions={mergeOptions(
        withMeta({
          onUpdate: async () => {
            await onRetag(updatesState.updates);
            updatesState.clear();
          },
          table: 'registry-repository-tags',
        })
      )}
      data-cy="registry-tags-datatable"
    />
  );
}
