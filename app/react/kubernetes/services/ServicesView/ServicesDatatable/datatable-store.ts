import { TableSettings } from '@CE/react/kubernetes/datatables/DefaultDatatableSettings';
import { systemResourcesSettings } from '@CE/react/kubernetes/datatables/SystemResourcesSettings';

import {
  refreshableSettings,
  createPersistedStore,
} from '@@CE/datatables/types';

export function createStore(storageKey: string) {
  return createPersistedStore<TableSettings>(storageKey, 'name', (set) => ({
    ...refreshableSettings(set),
    ...systemResourcesSettings(set),
  }));
}
