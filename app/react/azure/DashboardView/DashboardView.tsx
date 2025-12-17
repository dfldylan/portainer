import { Package } from 'lucide-react';

import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import Subscription from '@CE/assets/ico/subscription.svg?c';

import { PageHeader } from '@@CE/PageHeader';
import { DashboardItem } from '@@CE/DashboardItem';
import { DashboardGrid } from '@@CE/DashboardItem/DashboardGrid';

import { useResourceGroups } from '../queries/useResourceGroups';
import { useSubscriptions } from '../queries/useSubscriptions';

export function DashboardView() {
  const environmentId = useEnvironmentId();

  const subscriptionsQuery = useSubscriptions(environmentId);

  const resourceGroupsQuery = useResourceGroups(
    environmentId,
    subscriptionsQuery.data
  );

  const subscriptionsCount = subscriptionsQuery.data?.length;
  const resourceGroupsCount = Object.values(
    resourceGroupsQuery.resourceGroups
  ).flatMap((x) => Object.values(x)).length;

  return (
    <>
      <PageHeader title="Home" breadcrumbs={[{ label: 'Dashboard' }]} reload />

      <div className="mx-4">
        {subscriptionsQuery.data && (
          <DashboardGrid>
            <DashboardItem
              value={subscriptionsCount as number}
              data-cy="subscriptions-count"
              isLoading={subscriptionsQuery.isLoading}
              isRefetching={subscriptionsQuery.isRefetching}
              icon={Subscription}
              type="Subscription"
            />
            {!resourceGroupsQuery.isError && !resourceGroupsQuery.isLoading && (
              <DashboardItem
                value={resourceGroupsCount}
                data-cy="resource-groups-count"
                isLoading={resourceGroupsQuery.isLoading}
                icon={Package}
                type="Resource group"
              />
            )}
          </DashboardGrid>
        )}
      </div>
    </>
  );
}
