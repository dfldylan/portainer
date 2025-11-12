import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { StackDuplicationForm } from '@/react/common/stacks/ItemView/StackDuplicationForm/StackDuplicationForm';
import { StackEditorTab } from '@/react/docker/stacks/ItemView/StackEditorTab/StackEditorTab';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { withCurrentUser } from '@/react-tools/withCurrentUser';

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
  )
  .component(
    'stackEditorTab',
    r2a(withUIRouter(withCurrentUser(StackEditorTab)), [
      'stackType',
      'composeSyntaxMaxVersion',
      'stackId',
      'versions',
      'isOrphaned',
      'onSubmit',
      'initialValues',
      'containerNames',
      'originalContainerNames',
      'onSubmitSettled',
    ])
  ).name;
