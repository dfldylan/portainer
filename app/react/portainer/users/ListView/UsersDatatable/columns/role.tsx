import { User, UserPlus } from 'lucide-react';

import { isEdgeAdmin } from '@CE/portainer/users/user.helpers';
import { RoleNames } from '@CE/portainer/users/types';

import { Icon } from '@@CE/Icon';

import { helper } from './helper';

export const role = helper.accessor(
  (item) =>
    `${RoleNames[item.Role]} ${
      item.isTeamLeader ? ' - team leader' : ''
    }`.trim(),
  {
    header: 'Role',
    cell: ({ getValue, row: { original: item } }) => {
      const icon =
        isEdgeAdmin({ Role: item.Role }) || item.isTeamLeader ? User : UserPlus;

      return (
        <span className="vertical-center">
          <Icon icon={icon} />
          {getValue() || '-'}
        </span>
      );
    },
  }
);
