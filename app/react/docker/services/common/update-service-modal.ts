import { openSwitchPrompt } from '@@CE/modals/SwitchPrompt';
import { ModalType } from '@@CE/modals';
import { buildConfirmButton } from '@@CE/modals/utils';

export async function confirmServiceForceUpdate(message: string) {
  const result = await openSwitchPrompt('Are you sure?', 'Re-pull image', {
    message,
    confirmButton: buildConfirmButton('Update'),
    modalType: ModalType.Warn,
    'data-cy': 'confirm-service-force-update',
  });

  return result ? { pullLatest: result.value } : undefined;
}
