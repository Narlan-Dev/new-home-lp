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

interface GiftCardProps {
  gift: Gift;
  onReserve: (gift: Gift) => void;
}

// ==============================|| GIFTS - CARD ||============================== //

export default function GiftCard({ gift, onReserve }: GiftCardProps) {
  const intl = useIntl();
  const name = intl.formatMessage({ id: `landing.gifts.items.${gift.id}` });

  return (
    <Box
      component="article"
      sx={{
        // preenche o contêiner da animação de entrada (Reveal) que o envolve
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px'
      }}
    >
      <Photo src={gift.image} alt={name} sx={{ height: 220, flexShrink: 0 }} />

      <Stack sx={{ flex: 1, gap: '6px', p: { xs: '14px', md: 2.5 } }}>
        <Typography variant="h5" component="h3" sx={{ fontSize: { xs: '1.3125rem', md: '1.625rem' }, lineHeight: 1.05 }}>
          {name}
        </Typography>
        <Typography sx={{ color: 'primary.main', fontWeight: 500, fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.302 }}>
          {intl.formatNumber(gift.price, { style: 'currency', currency: 'BRL' })}
        </Typography>

        <Stack sx={{ mt: 'auto', pt: '14px', gap: 1 }}>
          <Button size="small" variant="contained" fullWidth onClick={() => onReserve(gift)}>
            <SafeFormattedMessage id="landing.gifts.cta.reserve" />
          </Button>
          <Button size="small" variant="outlined" fullWidth href={gift.url} target="_blank" rel="noopener noreferrer">
            <SafeFormattedMessage id="landing.gifts.cta.view" />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
