import { ReactNode } from 'react';

// material-ui
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';

export interface ConfirmDialogProps {
  title: ReactNode;
  message: ReactNode;
  icon?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  confirmColor?: ButtonProps['color'];
  onConfirm: () => void;
  onCancel: () => void;
  open?: boolean;
  onClose?: () => void;
  /** chamado ao terminar a animação de saída (o provider então descarta o diálogo) */
  onExited?: () => void;
}

const TITLE_ID = 'confirm-dialog-title';
const MESSAGE_ID = 'confirm-dialog-message';

// ==============================|| MODAL - CONFIRM DIALOG ||============================== //

export default function ConfirmDialog({
  title,
  message,
  icon,
  confirmText,
  cancelText,
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  open = false,
  onClose,
  onExited
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose ?? onCancel}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      aria-labelledby={TITLE_ID}
      aria-describedby={MESSAGE_ID}
      slotProps={{ transition: { onExited } }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Stack sx={{ gap: 2, alignItems: 'center' }}>
          {icon}
          <DialogTitle
            id={TITLE_ID}
            variant="h4"
            // o h4 define tamanho e altura de linha também em `md`; por isso o override informa os dois breakpoints
            sx={{ p: 0, textAlign: 'center', fontSize: { xs: '1.75rem', md: '1.75rem' }, lineHeight: { xs: 1.211, md: 1.211 } }}
          >
            {title}
          </DialogTitle>
          <Typography id={MESSAGE_ID} align="center" color="text.secondary">
            {message}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onCancel}>
          {cancelText ?? <SafeFormattedMessage id="action.cancel" />}
        </Button>
        <Button color={confirmColor} variant="contained" onClick={onConfirm}>
          {confirmText ?? <SafeFormattedMessage id="action.confirm" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
