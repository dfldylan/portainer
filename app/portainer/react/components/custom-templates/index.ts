import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { CustomTemplatesVariablesDefinitionField } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesDefinitionField';
import { CustomTemplatesVariablesField } from '@CE/react/portainer/custom-templates/components/CustomTemplatesVariablesField';
import { withControlledInput } from '@CE/react-tools/withControlledInput';

import { VariablesFieldAngular } from './variables-field';

export const ngModule = angular
  .module('portainer.app.react.components.custom-templates', [])
  .component(
    'customTemplatesVariablesFieldReact',
    r2a(withControlledInput(CustomTemplatesVariablesField), [
      'value',
      'onChange',
      'definitions',
      'errors',
    ])
  )
  .component('customTemplatesVariablesField', VariablesFieldAngular)
  .component(
    'customTemplatesVariablesDefinitionField',
    r2a(withControlledInput(CustomTemplatesVariablesDefinitionField), [
      'onChange',
      'value',
      'errors',
      'isVariablesNamesFromParent',
    ])
  );

export const customTemplatesModule = ngModule.name;
