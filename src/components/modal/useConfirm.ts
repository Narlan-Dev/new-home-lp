import { useContext } from 'react';

// project-imports
import { ConfirmContext } from './ConfirmProvider';

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm deve ser usado dentro de <ConfirmProvider>');
  return confirm;
}
