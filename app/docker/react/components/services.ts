import angular from 'angular';
import { SchemaOf } from 'yup';

import { r2a } from '@CE/react-tools/react2angular';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { ServicesDatatable } from '@CE/react/docker/services/ListView/ServicesDatatable';
import { TasksDatatable } from '@CE/react/docker/services/ItemView/TasksDatatable';
import {
  PortsMappingField,
  portsMappingUtils,
  PortsMappingValues,
} from '@CE/react/docker/services/ItemView/PortMappingField';
import { withFormValidation } from '@CE/react-tools/withFormValidation';

const ngModule = angular
  .module('portainer.docker.react.components.services', [])
  .component(
    'dockerServiceTasksDatatable',
    r2a(withUIRouter(withCurrentUser(TasksDatatable)), [
      'serviceName',
      'dataset',
      'isSlotColumnVisible',
    ])
  )
  .component(
    'dockerServicesDatatable',
    r2a(withUIRouter(withCurrentUser(ServicesDatatable)), [
      'dataset',
      'isAddActionVisible',
      'isStackColumnVisible',
      'onRefresh',
      'titleIcon',
      'tableKey',
    ])
  );

export const servicesModule = ngModule.name;

withFormValidation(
  ngModule,
  withUIRouter(withCurrentUser(PortsMappingField)),
  'dockerServicePortsMappingField',
  ['disabled', 'readOnly', 'hasChanges', 'onReset', 'onSubmit'],
  portsMappingUtils.validation as unknown as () => SchemaOf<PortsMappingValues>
);
