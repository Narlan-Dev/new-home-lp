import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { GIFTS, GIFTS_PREVIEW_COUNT } from 'constants/gifts';
import { SECTION_IDS } from 'constants/routes';
import GiftCard from 'sections/gifts/GiftCard';
import ReserveGiftDialog from 'sections/gifts/ReserveGiftDialog';

// types
import { Gift } from 'types/gifts';

// ==============================|| LANDING - GIFTS PAGE ||============================== //

export default function Gifts() {
  const [expanded, setExpanded] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibleGifts = expanded ? GIFTS : GIFTS.slice(0, GIFTS_PREVIEW_COUNT);

  const handleReserve = (gift: Gift) => {
    setSelectedGift(gift);
    setDialogOpen(true);
  };

  return (
    <Section id={SECTION_IDS.GIFTS} tone="soft">
      <SectionHeader
        eyebrow={<SafeFormattedMessage id="landing.gifts.eyebrow" />}
        title={<SafeFormattedMessage id="landing.gifts.title" />}
        description={<SafeFormattedMessage id="landing.gifts.description" />}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gridAutoRows: { xs: 'minmax(440px, auto)', md: 'auto' },
          gap: { xs: '12px', md: 3 },
          pt: { xs: '44px', md: 8 }
        }}
      >
        {/* os cards sobem em sequência (esquerda para a direita) conforme aparecem na tela */}
        {visibleGifts.map((gift) => (
          <Reveal key={gift.id} group="gifts" stagger={90} distance={32} sx={{ display: 'flex' }}>
            <GiftCard gift={gift} onReserve={handleReserve} />
          </Reveal>
        ))}
      </Box>

      {!expanded && (
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
