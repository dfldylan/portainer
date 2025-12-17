import { useField } from 'formik';

import { SwitchField } from '@@CE/form-components/SwitchField';

export const privacyPolicyUrl = 'https://www.portainer.io/legal/privacy-policy';

export function EnableTelemetryField() {
  const [{ value }, , { setValue }] = useField<boolean>('enableTelemetry');

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          labelClass="col-sm-3 col-lg-2"
          data-cy="settings-enable-telemetry-switch"
          label="Allow the collection of anonymous statistics"
          checked={value}
          name="toggle_enableTelemetry"
          onChange={(checked) => setValue(checked)}
        />
      </div>

      <div className="col-sm-12 text-muted small mt-2">
        You can find more information about this in our{' '}
        <a href={privacyPolicyUrl} target="_blank" rel="noreferrer">
          privacy policy
        </a>
        .
      </div>
    </div>
  );
}
