import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { AutoUpdateFieldset } from '@CE/react/portainer/gitops/AutoUpdateFieldset';
import { GitForm } from '@CE/react/portainer/gitops/GitForm';
import { AuthFieldset } from '@CE/react/portainer/gitops/AuthFieldset';
import { InfoPanel } from '@CE/react/portainer/gitops/InfoPanel';
import { RefField } from '@CE/react/portainer/gitops/RefField';
import { TimeWindowDisplay } from '@CE/react/portainer/gitops/TimeWindowDisplay';

export const gitFormModule = angular
  .module('portainer.app.components.forms.git', [])
  .component(
    'reactGitForm',
    r2a(withUIRouter(withReactQuery(withCurrentUser(GitForm))), [
      'value',
      'onChange',
      'environmentType',
      'isDockerStandalone',
      'deployMethod',
      'isAdditionalFilesFieldVisible',
      'isForcePullVisible',
      'isAuthExplanationVisible',
      'errors',
      'baseWebhookUrl',
      'webhookId',
      'webhooksDocs',
      'createdFromCustomTemplateId',
      'isAutoUpdateVisible',
    ])
  )
  .component(
    'gitFormInfoPanel',
    r2a(InfoPanel, [
      'additionalFiles',
      'className',
      'configFilePath',
      'type',
      'url',
    ])
  )
  .component(
    'reactGitFormAutoUpdateFieldset',
    r2a(withUIRouter(withReactQuery(AutoUpdateFieldset)), [
      'value',
      'onChange',
      'environmentType',
      'isForcePullVisible',
      'errors',
      'baseWebhookUrl',
      'webhookId',
      'webhooksDocs',
    ])
  )
  .component(
    'reactGitFormAuthFieldset',
    r2a(withUIRouter(withReactQuery(withCurrentUser(AuthFieldset))), [
      'value',
      'isAuthExplanationVisible',
      'onChange',
      'errors',
    ])
  )
  .component(
    'reactGitFormRefField',
    r2a(withUIRouter(withReactQuery(withCurrentUser(RefField))), [
      'error',
      'model',
      'onChange',
      'stackId',
      'createdFromCustomTemplateId',
      'value',
      'isUrlValid',
    ])
  )
  .component(
    'timeWindowDisplay',
    r2a(withReactQuery(withUIRouter(TimeWindowDisplay)), [])
  ).name;
