import { useField } from 'formik';

import { confirm } from '@@CE/modals/confirm';
import { FormControl } from '@@CE/form-components/FormControl';
import { Switch } from '@@CE/form-components/SwitchField/Switch';
import { buildConfirmButton } from '@@CE/modals/utils';
import { ModalType } from '@@CE/modals';

export function EnabledWaitingRoomSwitch() {
  const [inputProps, meta, helpers] = useField<boolean>('EnableWaitingRoom');

  return (
    <FormControl
      inputId="edge_waiting_room"
      label="Enable Edge Environment Waiting Room"
      size="medium"
      errors={meta.error}
    >
      <Switch
        id="edge_waiting_room"
        data-cy="edge-waiting-room-switch"
        name="EnableWaitingRoom"
        className="space-right"
        checked={inputProps.value}
        onChange={handleChange}
      />
    </FormControl>
  );

  async function handleChange(enable: boolean) {
    if (enable) {
      helpers.setValue(true);
      return;
    }

    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: 'Disable Edge Environment Waiting Room',
      message:
        'By disabling the waiting room feature, all devices requesting association will be automatically associated and could pose a security risk. Are you sure?',
      confirmButton: buildConfirmButton('Confirm', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    helpers.setValue(false);
  }
}
