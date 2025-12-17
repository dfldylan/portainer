import { FormSection } from '@@CE/form-components/FormSection';
import {
  EnvVarValues,
  EnvironmentVariablesFieldset,
} from '@@CE/form-components/EnvironmentVariablesFieldset';
import { ArrayError } from '@@CE/form-components/InputList/InputList';

type Props = {
  values: EnvVarValues;
  onChange(value: EnvVarValues): void;
  errors?: ArrayError<EnvVarValues>;
};

export function EnvironmentVariablesFormSection({
  values,
  onChange,
  errors,
}: Props) {
  return (
    <FormSection title="Environment variables" titleSize="sm">
      <div className="mb-4">
        <EnvironmentVariablesFieldset
          values={values}
          onChange={onChange}
          errors={errors}
        />
      </div>
    </FormSection>
  );
}
