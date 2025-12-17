import clsx from 'clsx';
import { PieChart } from 'lucide-react';

import { Icon } from '@CE/react/components/Icon';
import { humanize } from '@CE/portainer/filters/filters';

interface Props {
  imagesTotalSize: number;
}

export function ImagesTotalSize({ imagesTotalSize }: Props) {
  return (
    <div className="vertical-center">
      <Icon icon={PieChart} className={clsx('space-right')} />
      {humanize(imagesTotalSize)}
    </div>
  );
}
