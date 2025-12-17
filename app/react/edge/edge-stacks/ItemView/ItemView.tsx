import { HardDriveIcon, LayersIcon } from 'lucide-react';

import { EditEdgeStackForm } from '@CE/react/edge/edge-stacks/ItemView/EditEdgeStackForm/EditEdgeStackForm';
import { useParamState } from '@CE/react/hooks/useParamState';
import { useIdParam } from '@CE/react/hooks/useIdParam';

import { NavTabs } from '@@CE/NavTabs';
import { PageHeader } from '@@CE/PageHeader';
import { Widget } from '@@CE/Widget';

import { useEdgeStack } from '../queries/useEdgeStack';

import { EnvironmentsDatatable } from './EnvironmentsDatatable';

export function ItemView() {
  const idParam = useIdParam('stackId');
  const edgeStackQuery = useEdgeStack(idParam);

  const [tab = 'stack', setTab] = useParamState<'stack' | 'environments'>(
    'tab'
  );

  if (!edgeStackQuery.data) {
    return null;
  }

  const stack = edgeStackQuery.data;

  return (
    <>
      <PageHeader
        title="Edit Edge stack"
        breadcrumbs={[
          { label: 'Edge Stacks', link: 'edge.stacks' },
          stack.Name,
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body className="!p-0">
              <NavTabs<'stack' | 'environments'>
                justified
                type="pills"
                options={[
                  {
                    id: 'stack',
                    label: 'Stack',
                    icon: LayersIcon,
                    children: (
                      <div className="p-5 pb-10">
                        <EditEdgeStackForm edgeStack={stack} />
                      </div>
                    ),
                  },
                  {
                    id: 'environments',
                    icon: HardDriveIcon,
                    label: 'Environments',
                    children: <EnvironmentsDatatable />,
                  },
                ]}
                selectedId={tab}
                onSelect={setTab}
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
