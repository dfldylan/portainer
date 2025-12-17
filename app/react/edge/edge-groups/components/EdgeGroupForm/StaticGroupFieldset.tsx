import { useFormikContext } from 'formik';

import { AssociatedEdgeGroupEnvironmentsSelector } from '@CE/react/edge/components/AssociatedEdgeGroupEnvironmentsSelector';

import { FormSection } from '@@CE/form-components/FormSection';
import { confirmDestructive } from '@@CE/modals/confirm';
import { buildConfirmButton } from '@@CE/modals/utils';

import { FormValues } from './types';

export function StaticGroupFieldset({ isEdit }: { isEdit?: boolean }) {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  return (
    <FormSection title="Associated environments">
      <div className="form-group">
        <AssociatedEdgeGroupEnvironmentsSelector
          value={values.environmentIds}
          error={errors.environmentIds}
          onChange={async (environmentIds, meta) => {
            if (meta.type === 'remove' && isEdit) {
              const confirmed = await confirmDestructive({
                title: 'Confirm action',
                message:
                  'Removing the environment from this group will remove its corresponding edge stacks',
                confirmButton: buildConfirmButton('Confirm'),
              });

              if (!confirmed) {
                return;
              }
            }

            setFieldValue('environmentIds', environmentIds);
          }}
          edgeGroupId={values.edgeGroupId}
        />
      </div>
    </FormSection>
  );
}
