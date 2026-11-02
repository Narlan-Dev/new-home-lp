import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import ErrorState from 'components/ErrorState';
import { GIFTS_PREVIEW_COUNT } from 'constants/gifts';
import { SECTION_IDS } from 'constants/routes';
import { useGifts } from 'framework/rest/gifts';
import GiftCard from 'sections/gifts/GiftCard';
import GiftCardSkeleton from 'sections/gifts/GiftCardSkeleton';
import ReserveGiftDialog from 'sections/gifts/ReserveGiftDialog';

// types
import { Gift } from 'types/gifts';

// quantos esqueletos aparecem enquanto a lista carrega (uma fileira no desktop, duas no mobile)
const SKELETON_COUNT = 4;

const gridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
  gridAutoRows: { xs: 'minmax(440px, auto)', md: 'auto' },
  gap: { xs: '12px', md: 3 },
  pt: { xs: '44px', md: 8 }
};

// ==============================|| LANDING - GIFTS PAGE ||============================== //

export default function Gifts() {
  const [expanded, setExpanded] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { gifts, isLoading, error, isFetching, refetch } = useGifts();

  const visibleGifts = expanded ? gifts : gifts.slice(0, GIFTS_PREVIEW_COUNT);
  const hasMore = !expanded && gifts.length > GIFTS_PREVIEW_COUNT;

  const handleReserve = (gift: Gift) => {
    setSelectedGift(gift);
    setDialogOpen(true);
  };

  let content;
  if (isLoading) {
    content = (
      <Box aria-busy="true" sx={gridSx}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <GiftCardSkeleton key={index} />
        ))}
      </Box>
    );
  } else if (error) {
    content = (
      <ErrorState
        message={<SafeFormattedMessage id="landing.gifts.loadError" />}
        retrying={isFetching}
        onRetry={() => void refetch()}
        sx={{ pt: { xs: '44px', md: 8 } }}
      />
    );
  } else if (gifts.length === 0) {
    content = (
      <Typography sx={{ pt: { xs: '44px', md: 8 }, textAlign: 'center', color: 'text.secondary' }}>
        <SafeFormattedMessage id="landing.gifts.empty" />
      </Typography>
    );
  } else {
    content = (
      <Box sx={gridSx}>
        {/* os cards sobem em sequência (esquerda para a direita) conforme aparecem na tela */}
        {visibleGifts.map((gift) => (
          <Reveal key={gift.id} group="gifts" stagger={90} distance={32} sx={{ display: 'flex' }}>
            <GiftCard gift={gift} onReserve={handleReserve} />
          </Reveal>
        ))}
      </Box>
    );
  }

  return (
    <Section id={SECTION_IDS.GIFTS} tone="soft">
      <SectionHeader
        eyebrow={<SafeFormattedMessage id="landing.gifts.eyebrow" />}
        title={<SafeFormattedMessage id="landing.gifts.title" />}
        description={<SafeFormattedMessage id="landing.gifts.description" />}
      />

      {content}

      {hasMore && (
        <Reveal variant="fade" sx={{ display: 'flex', justifyContent: 'center', pt: { xs: '36px', md: 7 } }}>
          <Button variant="outlined" onClick={() => setExpanded(true)}>
            <SafeFormattedMessage id="landing.gifts.cta.more" />
          </Button>
        </Reveal>
      )}

      {/* a `key` reinicia o estado do modal a cada presente escolhido */}
      <ReserveGiftDialog
        key={selectedGift?.id ?? 'none'}
        gift={selectedGift}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onExited={() => setSelectedGift(null)}
      />
    </Section>
  );
}
