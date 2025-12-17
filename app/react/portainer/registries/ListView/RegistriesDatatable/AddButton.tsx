import { Authorized } from '@CE/react/hooks/useUser';

import { AddButton as BaseAddButton } from '@@CE/buttons';

export function AddButton() {
  return (
    <Authorized authorizations="OperationPortainerRegistryCreate" adminOnlyCE>
      <BaseAddButton
        data-cy="registry-addRegistryButton"
        to="portainer.registries.new"
      >
        Add registry
      </BaseAddButton>
    </Authorized>
  );
}
