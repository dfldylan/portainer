import { array, string } from 'yup';

import { FormError } from '@@CE/form-components/FormError';
import { InputLabeled } from '@@CE/form-components/Input/InputLabeled';
import { ItemProps } from '@@CE/form-components/InputList';
import {
  ArrayError,
  InputList,
} from '@@CE/form-components/InputList/InputList';

export const hostFileSchema = array(
  string().required('Entry is required')
).default([]);

export function HostsFileEntries({
  values,
  onChange,
  errors,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  errors?: ArrayError<string>;
}) {
  return (
    <InputList
      label="Hosts file entries"
      value={values}
      onChange={(hostsFileEntries) => onChange(hostsFileEntries)}
      errors={errors}
      item={HostsFileEntryItem}
      itemBuilder={() => ''}
      data-cy="hosts-file-entries"
    />
  );
}

function HostsFileEntryItem({
  item,
  onChange,
  disabled,
  error,
  readOnly,
  index,
}: ItemProps<string>) {
  return (
    <div>
      <InputLabeled
        label="value"
        value={item}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        data-cy={`hosts-file-entry_${index}`}
      />

      {error && <FormError>{error}</FormError>}
    </div>
  );
}
