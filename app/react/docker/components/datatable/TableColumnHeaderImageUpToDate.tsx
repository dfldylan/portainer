import UpdatesAvailable from '@CE/assets/ico/icon_updates-available.svg?c';
import UpToDate from '@CE/assets/ico/icon_up-to-date.svg?c';
import UpdatesUnknown from '@CE/assets/ico/icon_updates-unknown.svg?c';
import { useEnvironment } from '@CE/react/portainer/environments/queries';
import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { isBE } from '@CE/react/portainer/feature-flags/feature-flags.service';

import { Icon } from '@@CE/Icon';
import { Tooltip } from '@@CE/Tip/Tooltip';
import {
  TableColumnHeaderAngular,
  TableColumnHeaderAngularProps,
} from '@@CE/datatables/TableHeaderCell';

export function TableColumnHeaderImageUpToDate({
  canSort,
  isSorted,
  colTitle,
  isSortedDesc = true,
}: TableColumnHeaderAngularProps) {
  return (
    <TableColumnHeaderAngular
      canSort={canSort}
      isSorted={isSorted}
      colTitle={colTitle}
      isSortedDesc={isSortedDesc}
    >
      <ImageUpToDateTooltip />
    </TableColumnHeaderAngular>
  );
}

export function ImageUpToDateTooltip() {
  const environmentId = useEnvironmentId();

  const enableImageNotificationQuery = useEnvironment(
    environmentId,
    (environment) => environment?.EnableImageNotification
  );

  if (!enableImageNotificationQuery.data) {
    return null;
  }

  if (!isBE) {
    return null;
  }

  return (
    <Tooltip
      position="top"
      message={
        <div className="flex flex-col gap-y-2 p-2">
          <div className="flex items-center gap-2">
            <Icon icon={UpToDate} />
            Images are up to date
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={UpdatesAvailable} />
            Updates are available
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={UpdatesUnknown} />
            Updates availability unknown
          </div>
        </div>
      }
    />
  );
}
