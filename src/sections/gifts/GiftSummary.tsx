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

interface GiftSummaryProps {
  gift: Gift;
  /** painel lateral (desktop) ou linha compacta (mobile) */
  variant: 'panel' | 'row';
}

// ==============================|| GIFTS - SUMMARY OF THE CHOSEN GIFT ||============================== //

export default function GiftSummary({ gift, variant }: GiftSummaryProps) {
  const intl = useIntl();
  const name = intl.formatMessage({ id: `landing.gifts.items.${gift.id}` });
  const price = intl.formatNumber(gift.price, { style: 'currency', currency: 'BRL' });
  const viewOnSite = (
    <Button variant="outlined" fullWidth href={gift.url} target="_blank" rel="noopener noreferrer">
      <SafeFormattedMessage id="reserve.summary.viewOnSite" />
    </Button>
  );

  if (variant === 'row') {
    return (
      <Stack sx={{ bgcolor: 'background.soft', p: 2.5, gap: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
          <Photo src={gift.image} alt={name} iconSize={29} sx={{ width: 72, height: 72, flexShrink: 0, borderRadius: '12px' }} />
          <Stack sx={{ gap: '2px', minWidth: 0 }}>
            <Typography variant="h4" component="p" sx={{ fontSize: { xs: '1.75rem', md: '1.75rem' }, lineHeight: 1.211 }}>
              {name}
            </Typography>
            <Typography sx={{ color: 'primary.main', fontWeight: 500, fontSize: { xs: '0.9375rem', md: '0.9375rem' }, lineHeight: 1.302 }}>
              {price}
            </Typography>
          </Stack>
        </Stack>
        {viewOnSite}
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: 340, flexShrink: 0, bgcolor: 'background.soft', p: 5, gap: 2.5 }}>
      <Typography variant="subtitle2" component="p" sx={{ color: 'secondary.main' }}>
        <SafeFormattedMessage id="reserve.summary.eyebrow" />
      </Typography>
      <Photo src={gift.image} alt={name} sx={{ height: 200, flexShrink: 0, borderRadius: '16px' }} />
      <Typography variant="h3" component="p" sx={{ fontSize: { xs: '2.25rem', md: '2.25rem' } }}>
        {name}
      </Typography>
      <Typography sx={{ color: 'primary.main', fontWeight: 500, fontSize: { xs: '1.125rem', md: '1.125rem' }, lineHeight: 1.302 }}>
        {price}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: { xs: '0.9375rem', md: '0.9375rem' } }}>
        <SafeFormattedMessage id="reserve.summary.description" />
      </Typography>
      <Box sx={{ mt: 'auto', pt: '12px' }}>{viewOnSite}</Box>
    </Stack>
  );
}
