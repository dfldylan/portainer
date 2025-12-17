import { useFormikContext } from 'formik';

import { EdgeGroupAssociationTable } from '@CE/react/edge/components/EdgeGroupAssociationTable';
import { EdgeTypes } from '@CE/react/portainer/environments/types';

import { BoxSelector } from '@@CE/BoxSelector';
import { TagSelector } from '@@CE/TagSelector';
import { FormSection } from '@@CE/form-components/FormSection';

import { tagOptions } from './tag-options';
import { FormValues } from './types';

export function DynamicGroupFieldset() {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();
  return (
    <>
      <FormSection title="Tags">
        <BoxSelector
          slim
          value={values.partialMatch}
          onChange={(partialMatch) =>
            setFieldValue('partialMatch', partialMatch)
          }
          options={tagOptions}
          radioName="partialMatch"
        />
        <TagSelector
          value={values.tagIds}
          onChange={(tagIds) => setFieldValue('tagIds', tagIds)}
          errors={errors.tagIds}
        />
      </FormSection>

      <EdgeGroupAssociationTable
        data-cy="edgeGroupCreate-associatedEnvironmentsTable"
        title="Associated environments by tags"
        query={{
          types: EdgeTypes,
          tagIds: values.tagIds,
          tagsPartialMatch: values.partialMatch,
        }}
      />
    </>
  );
}
