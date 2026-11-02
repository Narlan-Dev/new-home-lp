import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import GiftSummary from './GiftSummary';
import ReserveGiftForm from './ReserveGiftForm';
import ReservedGift from './ReservedGift';

// types
import { Gift } from 'types/gifts';

// assets
import { CloseIcon } from 'assets/icons';

interface ReserveGiftDialogProps {
  gift: Gift | null;
  open: boolean;
  onClose: () => void;
  /** chamado ao terminar a animação de saída (o pai pode então descartar o presente escolhido) */
  onExited: () => void;
}

const TITLE_ID = 'reserve-gift-title';

// ==============================|| GIFTS - RESERVE DIALOG ||============================== //

// modal em duas etapas: formulário de reserva -> confirmação. Tela cheia no mobile, modal centralizado no desktop.
export default function ReserveGiftDialog({ gift, open, onClose, onExited }: ReserveGiftDialogProps) {
  const intl = useIntl();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [guestName, setGuestName] = useState<string | null>(null);
  const reserved = guestName !== null;

  const closeLabel = intl.formatMessage({ id: 'reserve.close' });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={false}
      scroll="paper"
      aria-labelledby={TITLE_ID}
      slotProps={{
        transition: { onExited },
        paper: { sx: fullScreen ? undefined : { width: reserved ? 560 : 960, maxWidth: 'calc(100% - 48px)' } }
      }}
    >
      {gift && reserved && <ReservedGift gift={gift} guestName={guestName} titleId={TITLE_ID} onClose={onClose} />}

      {gift && !reserved && !fullScreen && (
        <Stack direction="row" sx={{ alignItems: 'stretch' }}>
          <GiftSummary gift={gift} variant="panel" />
          <Stack sx={{ flex: 1, minWidth: 0, p: 6, gap: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2 }}>
              <Stack sx={{ flex: 1, gap: '6px' }}>
                <Typography id={TITLE_ID} variant="h3" component="h2" sx={{ fontSize: { xs: '2.75rem', md: '2.75rem' } }}>
                  <SafeFormattedMessage id="reserve.title" />
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.302 }}>
                  <SafeFormattedMessage id="reserve.subtitle" />
                </Typography>
              </Stack>
              <IconButton
                aria-label={closeLabel}
                onClick={onClose}
                sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', color: 'text.primary' }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
            <ReserveGiftForm gift={gift} onCancel={onClose} onReserved={setGuestName} />
          </Stack>
        </Stack>
      )}

      {gift && !reserved && fullScreen && (
        <Stack>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: '18px',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography id={TITLE_ID} variant="h4" component="h2" sx={{ fontSize: { xs: '1.75rem', md: '1.75rem' }, lineHeight: 1.211 }}>
              <SafeFormattedMessage id="reserve.title" />
            </Typography>
            <IconButton aria-label={closeLabel} onClick={onClose} sx={{ p: 0, color: 'text.primary' }}>
              <CloseIcon size={24} />
            </IconButton>
          </Stack>
          <GiftSummary gift={gift} variant="row" />
          <Box sx={{ px: 2.5, pt: '28px', pb: 4 }}>
            <Stack sx={{ gap: '20px' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
                <SafeFormattedMessage id="reserve.summary.description" />
              </Typography>
              <ReserveGiftForm gift={gift} onCancel={onClose} onReserved={setGuestName} />
            </Stack>
          </Box>
        </Stack>
      )}
    </Dialog>
  );
}
