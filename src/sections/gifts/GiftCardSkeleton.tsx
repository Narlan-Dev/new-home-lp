// material-ui
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

// project-imports
import { giftCardSx } from './GiftCard';

// ==============================|| GIFTS - CARD SKELETON ||============================== //

// ocupa o lugar do cartão enquanto a lista de presentes chega do banco
export default function GiftCardSkeleton() {
  return (
    <Box aria-hidden="true" sx={giftCardSx}>
      <Skeleton variant="rectangular" height={220} sx={{ flexShrink: 0 }} />
      <Stack sx={{ flex: 1, gap: '10px', p: { xs: '14px', md: 2.5 } }}>
        <Skeleton variant="text" width="75%" sx={{ fontSize: '1.625rem' }} />
        <Skeleton variant="text" width="35%" />
        <Stack sx={{ mt: 'auto', pt: '14px', gap: 1 }}>
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 999 }} />
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 999 }} />
        </Stack>
      </Stack>
    </Box>
  );
}
