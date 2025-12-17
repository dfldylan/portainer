import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { AssociatedEdgeEnvironmentsSelector } from '@CE/react/edge/components/AssociatedEdgeEnvironmentsSelector';
import { EdgeAsyncIntervalsForm } from '@CE/react/edge/components/EdgeAsyncIntervalsForm';
import { EdgeCheckinIntervalField } from '@CE/react/edge/components/EdgeCheckInIntervalField';
import { EdgeScriptForm } from '@CE/react/edge/components/EdgeScriptForm';
import { EdgeGroupsSelector } from '@CE/react/edge/edge-stacks/components/EdgeGroupsSelector';
import { AssociatedEdgeGroupEnvironmentsSelector } from '@CE/react/edge/components/AssociatedEdgeGroupEnvironmentsSelector';

const ngModule = angular
  .module('portainer.edge.react.components', [])

  .component(
    'edgeGroupsSelector',
    r2a(withUIRouter(withReactQuery(EdgeGroupsSelector)), [
      'onChange',
      'value',
      'error',
      'horizontal',
      'isGroupVisible',
      'required',
    ])
  )
  .component(
    'edgeScriptForm',
    r2a(withReactQuery(EdgeScriptForm), [
      'edgeInfo',
      'commands',
      'asyncMode',
      'showMetaFields',
    ])
  )
  .component(
    'edgeCheckinIntervalField',
    r2a(withReactQuery(EdgeCheckinIntervalField), [
      'value',
      'onChange',
      'isDefaultHidden',
      'tooltip',
      'label',
      'readonly',
      'size',
    ])
  )
  .component(
    'edgeAsyncIntervalsForm',
    r2a(withReactQuery(EdgeAsyncIntervalsForm), [
      'values',
      'onChange',
      'isDefaultHidden',
      'readonly',
      'fieldSettings',
    ])
  )
  .component(
    'associatedEdgeEnvironmentsSelector',
    r2a(withReactQuery(AssociatedEdgeEnvironmentsSelector), [
      'onChange',
      'value',
      'error',
    ])
  )
  .component(
    'associatedEdgeGroupEnvironmentsSelector',
    r2a(withReactQuery(AssociatedEdgeGroupEnvironmentsSelector), [
      'onChange',
      'value',
      'error',
      'edgeGroupId',
    ])
  );

export const componentsModule = ngModule.name;
