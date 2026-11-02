import { createContext, ReactNode, useCallback, useState } from 'react';

// project-imports
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog';

export type ConfirmOptions = Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel' | 'open' | 'onClose' | 'onExited'>;
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

// ==============================|| MODAL - CONFIRM PROVIDER ||============================== //

// mesmo uso do `useConfirm` da cinova-portal (`await confirm({ ... })`), sem depender do jotai
export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [open, setOpen] = useState(false);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        setPending({ options, resolve });
        setOpen(true);
      }),
    []
  );

  const settle = (confirmed: boolean) => {
    pending?.resolve(confirmed);
    // o diálogo sai com animação; `pending` só é descartado quando ela termina (onExited)
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <ConfirmDialog
          {...pending.options}
          open={open}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
          onExited={() => setPending(null)}
        />
      )}
    </ConfirmContext.Provider>
  );
}
