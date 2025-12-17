import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { AnnotationsBeTeaser } from '@CE/react/kubernetes/annotations/AnnotationsBeTeaser';
import { withFormValidation } from '@CE/react-tools/withFormValidation';
import { GroupAssociationTable } from '@CE/react/portainer/environments/environment-groups/components/GroupAssociationTable';
import { AssociatedEnvironmentsSelector } from '@CE/react/portainer/environments/environment-groups/components/AssociatedEnvironmentsSelector';
import { withControlledInput } from '@CE/react-tools/withControlledInput';
import { NamespacePortainerSelect } from '@CE/react/kubernetes/applications/components/NamespaceSelector/NamespaceSelector';

import {
  EnvironmentVariablesFieldset,
  EnvironmentVariablesPanel,
  StackEnvironmentVariablesPanel,
  envVarValidation,
} from '@@CE/form-components/EnvironmentVariablesFieldset';
import { Icon } from '@@CE/Icon';
import { ReactQueryDevtoolsWrapper } from '@@CE/ReactQueryDevtoolsWrapper';
import { PageHeader } from '@@CE/PageHeader';
import { TagSelector } from '@@CE/TagSelector';
import { Loading } from '@@CE/Widget/Loading';
import { PasswordCheckHint } from '@@CE/PasswordCheckHint';
import { Tooltip } from '@@CE/Tip/Tooltip';
import { Badge } from '@@CE/Badge';
import { TableColumnHeaderAngular } from '@@CE/datatables/TableHeaderCell';
import { DashboardItem } from '@@CE/DashboardItem';
import { SearchBar } from '@@CE/datatables/SearchBar';
import { FallbackImage } from '@@CE/FallbackImage';
import { BadgeIcon } from '@@CE/BadgeIcon';
import { TeamsSelector } from '@@CE/TeamsSelector';
import { TerminalTooltip } from '@@CE/TerminalTooltip';
import { PortainerSelect } from '@@CE/form-components/PortainerSelect';
import { Slider } from '@@CE/form-components/Slider';
import { TagButton } from '@@CE/TagButton';
import { BETeaserButton } from '@@CE/BETeaserButton';
import { CodeEditor } from '@@CE/CodeEditor';
import { HelpLink } from '@@CE/HelpLink';
import { TextTip } from '@@CE/Tip/TextTip';
import { InlineLoader } from '@@CE/InlineLoader/InlineLoader';

import { fileUploadField } from './file-upload-field';
import { switchField } from './switch-field';
import { customTemplatesModule } from './custom-templates';
import { gitFormModule } from './git-form';
import { settingsModule } from './settings';
import { accessControlModule } from './access-control';
import { environmentsModule } from './environments';
import { registriesModule } from './registries';
import { accountModule } from './account';
import { usersModule } from './users';
import { activityLogsModule } from './activity-logs';
import { rbacModule } from './rbac';
import { stacksModule } from './stacks';

export const ngModule = angular
  .module('portainer.app.react.components', [
    accessControlModule,
    customTemplatesModule,
    environmentsModule,
    gitFormModule,
    registriesModule,
    settingsModule,
    accountModule,
    usersModule,
    activityLogsModule,
    rbacModule,
    stacksModule,
  ])
  .component(
    'tagSelector',
    r2a(withUIRouter(withReactQuery(TagSelector)), [
      'allowCreate',
      'onChange',
      'value',
      'errors',
    ])
  )
  .component(
    'beTeaserButton',
    r2a(BETeaserButton, [
      'featureId',
      'heading',
      'message',
      'buttonText',
      'className',
      'buttonClassName',
      'data-cy',
    ])
  )
  .component(
    'tagButton',
    r2a(TagButton, ['value', 'label', 'title', 'onRemove'])
  )

  .component(
    'portainerTooltip',
    r2a(Tooltip, ['message', 'position', 'className', 'setHtmlMessage', 'size'])
  )
  .component('terminalTooltip', r2a(TerminalTooltip, []))
  .component('badge', r2a(Badge, ['type', 'className', 'data-cy']))
  .component('fileUploadField', fileUploadField)
  .component('porSwitchField', switchField)
  .component(
    'passwordCheckHint',
    r2a(withReactQuery(PasswordCheckHint), [
      'forceChangePassword',
      'passwordValid',
    ])
  )
  .component('rdLoading', r2a(Loading, []))
  .component(
    'tableColumnHeader',
    r2a(TableColumnHeaderAngular, [
      'colTitle',
      'canSort',
      'isSorted',
      'isSortedDesc',
    ])
  )
  .component(
    'pageHeader',
    r2a(withUIRouter(withReactQuery(withCurrentUser(PageHeader))), [
      'title',
      'breadcrumbs',
      'loading',
      'onReload',
      'reload',
      'id',
    ])
  )
  .component(
    'fallbackImage',
    r2a(FallbackImage, ['src', 'fallbackIcon', 'alt', 'className'])
  )
  .component('prIcon', r2a(Icon, ['className', 'icon', 'mode', 'size', 'spin']))
  .component(
    'reactQueryDevTools',
    r2a(withReactQuery(ReactQueryDevtoolsWrapper), [])
  )
  .component(
    'helpLink',
    r2a(withUIRouter(withReactQuery(HelpLink)), [
      'docLink',
      'target',
      'children',
    ])
  )
  .component(
    'dashboardItem',
    r2a(DashboardItem, [
      'icon',
      'type',
      'value',
      'to',
      'params',
      'children',
      'pluralType',
      'isLoading',
      'isRefetching',
      'data-cy',
      'iconClass',
    ])
  )
  .component(
    'datatableSearchbar',
    r2a(SearchBar, [
      'data-cy',
      'onChange',
      'value',
      'placeholder',
      'children',
      'className',
    ])
  )
  .component('badgeIcon', r2a(BadgeIcon, ['icon', 'size', 'iconClass']))
  .component(
    'teamsSelector',
    r2a(TeamsSelector, [
      'onChange',
      'value',
      'dataCy',
      'inputId',
      'name',
      'placeholder',
      'teams',
      'disabled',
    ])
  )
  .component(
    'porSelect',
    r2a(PortainerSelect, [
      'name',
      'inputId',
      'placeholder',
      'disabled',
      'data-cy',
      'bindToBody',
      'value',
      'onChange',
      'options',
      'isMulti',
      'filterOption',
      'isClearable',
      'components',
      'isLoading',
      'noOptionsMessage',
      'aria-label',
      'size',
      'loadingMessage',
      'getOptionValue',
    ])
  )
  .component(
    'namespacePortainerSelect',
    r2a(NamespacePortainerSelect, [
      'value',
      'onChange',
      'isDisabled',
      'options',
    ])
  )
  .component(
    'porSlider',
    r2a(Slider, [
      'min',
      'max',
      'step',
      'value',
      'onChange',
      'visibleTooltip',
      'dataCy',
      'disabled',
    ])
  )
  .component(
    'reactCodeEditor',
    r2a(CodeEditor, [
      'id',
      'textTip',
      'type',
      'readonly',
      'onChange',
      'value',
      'height',
      'data-cy',
      'versions',
      'onVersionChange',
      'schema',
      'fileName',
      'placeholder',
      'showToolbar',
      'aria-label',
    ])
  )
  .component(
    'textTip',
    r2a(TextTip, [
      'className',
      'color',
      'icon',
      'inline',
      'children',
      'childrenWrapperClassName',
    ])
  )
  .component(
    'inlineLoader',
    r2a(InlineLoader, ['children', 'className', 'size'])
  )
  .component(
    'groupAssociationTable',
    r2a(withReactQuery(GroupAssociationTable), [
      'onClickRow',
      'query',
      'title',
      'data-cy',
    ])
  )
  .component('annotationsBeTeaser', r2a(AnnotationsBeTeaser, []))
  .component(
    'associatedEndpointsSelector',
    r2a(withReactQuery(AssociatedEnvironmentsSelector), ['onChange', 'value'])
  );

export const componentsModule = ngModule.name;

withFormValidation(
  ngModule,
  withControlledInput(EnvironmentVariablesFieldset, { values: 'onChange' }),
  'environmentVariablesFieldset',
  ['canUndoDelete'],
  envVarValidation
);

withFormValidation(
  ngModule,
  withControlledInput(EnvironmentVariablesPanel, { values: 'onChange' }),
  'environmentVariablesPanel',
  ['explanation', 'showHelpMessage', 'isFoldable'],
  envVarValidation
);

withFormValidation(
  ngModule,
  withUIRouter(
    withReactQuery(
      withControlledInput(StackEnvironmentVariablesPanel, {
        values: 'onChange',
      })
    )
  ),
  'stackEnvironmentVariablesPanel',
  ['showHelpMessage', 'isFoldable'],
  envVarValidation
);
