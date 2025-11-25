import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { StackDuplicationForm } from '@/react/common/stacks/ItemView/StackDuplicationForm/StackDuplicationForm';
import { StackEditorTab } from '@/react/docker/stacks/ItemView/StackEditorTab/StackEditorTab';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { StackInfoTab } from '@/react/docker/stacks/ItemView/StackInfoTab/StackInfoTab';

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
  )

  .component(
    'stackInfoTab',
    r2a(withUIRouter(withCurrentUser(StackInfoTab)), [
      'stack',
      'stackName',
      'stackFileContent',
      'isRegular',
      'isExternal',
      'isOrphaned',
      'environmentId',
      'isOrphanedRunning',
      'yamlError',
    ])
  ).name;
