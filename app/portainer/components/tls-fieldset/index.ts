import angular from 'angular';

import {
  TLSFieldset,
  tlsConfigValidation,
} from '@CE/react/components/TLSFieldset';
import { withFormValidation } from '@CE/react-tools/withFormValidation';

export const ngModule = angular.module(
  'portainer.app.components.tls-fieldset',
  []
);

export const tlsFieldsetModule = ngModule.name;

withFormValidation(
  ngModule,
  TLSFieldset,
  'tlsFieldset',
  [],
  tlsConfigValidation
);
