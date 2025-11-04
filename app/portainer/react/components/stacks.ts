import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { StackDuplicationForm } from '@/react/common/stacks/ItemView/StackDuplicationForm/StackDuplicationForm';
import { withUIRouter } from '@/react-tools/withUIRouter';

export const stacksModule = angular
  .module('portainer.app.react.components.stacks', [])
  .component(
    'stackDuplicationForm',
    r2a(withUIRouter(withReactQuery(StackDuplicationForm)), [
      'yamlError',
      'currentEnvironmentId',
      'originalFileContent',
      'stack',
    ])
  ).name;
