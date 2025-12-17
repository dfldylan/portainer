import { FormikErrors } from 'formik';

import { useEnvironmentId } from '@CE/react/hooks/useEnvironmentId';
import { useNamespacesQuery } from '@CE/react/kubernetes/namespaces/queries/useNamespacesQuery';

import { FormControl } from '@@CE/form-components/FormControl';
import { PortainerSelect } from '@@CE/form-components/PortainerSelect';

type Props = {
  onChange: (value: string) => void;
  values: string;
  errors: FormikErrors<string>;
  isEdit: boolean;
};

export function NamespaceSelector({
  values: value,
  onChange,
  errors,
  isEdit,
}: Props) {
  const environmentId = useEnvironmentId();
  const { data: namespaces, ...namespacesQuery } =
    useNamespacesQuery(environmentId);
  const namespaceNames = Object.entries(namespaces ?? {})
    .filter(([, ns]) => !ns.IsSystem)
    .map(([, ns]) => ({
      label: ns.Name,
      value: ns.Name,
    }));

  return (
    <FormControl
      label="Namespace"
      inputId="namespace-selector"
      isLoading={namespacesQuery.isLoading}
      errors={errors}
    >
      {namespaceNames.length > 0 && (
        <PortainerSelect
          value={value}
          options={namespaceNames}
          onChange={onChange}
          disabled={isEdit}
          noOptionsMessage={() => 'No namespaces found'}
          placeholder="No namespaces found" // will only show when there are no options
          inputId="namespace-selector"
          data-cy="k8sAppCreate-nsSelect"
        />
      )}
    </FormControl>
  );
}

/** NamespacePortainerSelect is exported for use by angular views, so that the data-cy attribute is set correctly */
export function NamespacePortainerSelect({
  value,
  onChange,
  isDisabled,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
  options: { label: string; value: string }[];
}) {
  return (
    <PortainerSelect
      value={value}
      options={options}
      onChange={onChange}
      disabled={isDisabled}
      noOptionsMessage={() => 'No namespaces found'}
      placeholder="No namespaces found" // will only show when there are no options
      inputId="namespace-selector"
      data-cy="namespace-select"
    />
  );
}
