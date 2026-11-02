import { ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';

interface ErrorStateProps {
  message: ReactNode;
  /** quando informado, mostra o botão "Tentar de novo" */
  onRetry?: () => void;
  retrying?: boolean;
  sx?: SxProps<Theme>;
}

// ==============================|| COMPONENT: ERROR STATE ||============================== //

export default function ErrorState({ message, onRetry, retrying = false, sx }: ErrorStateProps) {
  return (
    <Stack role="alert" sx={[{ alignItems: 'center', gap: 2, py: 6, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry} loading={retrying}>
          <SafeFormattedMessage id="action.retry" />
        </Button>
      )}
    </Stack>
  );
}
