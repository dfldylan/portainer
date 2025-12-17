import { Cpu, HardDrive } from 'lucide-react';

import { KubernetesSnapshot } from '@CE/react/portainer/environments/types';
import { humanize } from '@CE/portainer/filters/filters';
import { addPlural } from '@CE/portainer/helpers/strings';
import Memory from '@CE/assets/ico/memory.svg?c';

import { StatsItem } from '@@CE/StatsItem';

interface Props {
  snapshot?: KubernetesSnapshot;
}

export function EnvironmentStatsKubernetes({ snapshot }: Props) {
  if (!snapshot) {
    return <>No snapshot available</>;
  }

  return (
    <>
      <StatsItem icon={Cpu} value={`${snapshot.TotalCPU} CPU`} />

      <StatsItem
        icon={Memory}
        value={`${humanize(snapshot.TotalMemory)} RAM`}
      />

      <StatsItem
        value={addPlural(snapshot.NodeCount, 'node')}
        icon={HardDrive}
      />
    </>
  );
}
