import { r2a } from '@CE/react-tools/react2angular';

import { SwitchField } from '@@CE/form-components/SwitchField';

export const switchField = r2a(SwitchField, [
  'tooltip',
  'checked',
  'index',
  'label',
  'name',
  'labelClass',
  'fieldClass',
  'data-cy',
  'disabled',
  'onChange',
  'featureId',
  'switchClass',
  'setTooltipHtmlMessage',
  'valueExplanation',
]);
