import { r2a } from '@CE/react-tools/react2angular';

import { FileUploadField } from '@@CE/form-components/FileUpload';

export const fileUploadField = r2a(FileUploadField, [
  'onChange',
  'value',
  'title',
  'required',
  'accept',
  'inputId',
  'data-cy',
  'color',
  'name',
]);
