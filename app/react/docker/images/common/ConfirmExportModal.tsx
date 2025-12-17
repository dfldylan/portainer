import { ModalType } from '@@CE/modals';
import { openConfirm } from '@@CE/modals/confirm';
import { buildConfirmButton } from '@@CE/modals/utils';

export async function confirmImageExport() {
  return openConfirm({
    modalType: ModalType.Warn,
    title: 'Caution',
    message:
      'The export may take several minutes, do not navigate away whilst the export is in progress.',
    confirmButton: buildConfirmButton('Continue'),
  });
}
