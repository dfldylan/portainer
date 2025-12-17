import { Authorized } from '@CE/react/hooks/useUser';

import { TextTip } from '@@CE/Tip/TextTip';

interface Props {
  showSystemResources?: boolean;
}

export function SystemResourceDescription({ showSystemResources }: Props) {
  return showSystemResources === false ? (
    <Authorized authorizations="K8sAccessSystemNamespaces" adminOnlyCE>
      <TextTip color="blue" className="!mb-0">
        System resources are hidden, this can be changed in the table settings
      </TextTip>
    </Authorized>
  ) : null;
}
