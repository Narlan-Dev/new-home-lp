// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Photo from 'components/@extended/Photo';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';

// types
import { Gift } from 'types/gifts';

// assets
import { CheckIcon } from 'assets/icons';

interface ReservedGiftProps {
  gift: Gift;
  guestName: string;
  /** id do título, usado como rótulo do diálogo */
  titleId: string;
  onClose: () => void;
}

// ==============================|| GIFTS - RESERVED CONFIRMATION ||============================== //

export default function ReservedGift({ gift, guestName, titleId, onClose }: ReservedGiftProps) {
  const intl = useIntl();
  const { name } = gift;

  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2.5,
        p: { xs: 3, md: 7 },
        minHeight: { xs: '100%', md: 'auto' }
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'background.soft',
          color: 'primary.main'
        }}
      >
        <CheckIcon />
      </Box>

      <Typography id={titleId} variant="h3" component="h2" sx={{ fontSize: { xs: '2.5rem', md: '2.875rem' } }}>
        <SafeFormattedMessage id="reserved.title" />
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1rem' } }}>
        <SafeFormattedMessage id="reserved.description" values={{ name: guestName }} />
      </Typography>

      <Stack
        direction="row"
        sx={{ alignItems: 'center', gap: 2, width: '100%', p: 2, textAlign: 'left', bgcolor: 'background.soft', borderRadius: '16px' }}
      >
        <Photo src={gift.image} alt={name} iconSize={26} sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: '12px' }} />
        <Stack sx={{ gap: '2px', minWidth: 0 }}>
          <Typography variant="h5" component="p" sx={{ fontSize: { xs: '1.625rem', md: '1.625rem' }, lineHeight: 1.211 }}>
            {name}
          </Typography>
          <Typography sx={{ color: 'primary.main', fontWeight: 500, fontSize: { xs: '0.9375rem', md: '0.9375rem' }, lineHeight: 1.302 }}>
            {intl.formatNumber(gift.price, { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Stack>
      </Stack>

      <Stack sx={{ width: '100%', pt: 1, gap: '12px' }}>
        <Button variant="contained" href={gift.url} target="_blank" rel="noopener noreferrer">
          <SafeFormattedMessage id="reserved.goToLink" />
        </Button>
        <Button variant="outlined" onClick={onClose}>
          <SafeFormattedMessage id="reserved.back" />
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        <SafeFormattedMessage id="reserved.note" />
      </Typography>
    </Stack>
  );
}
