import { ReactNode, useEffect } from 'react';
import { Link as RouterLink } from 'react-router';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { CONTACT } from 'constants/contact';
import { COUPLE } from 'constants/event';
import { HERO_AUTOPLAY_MS, HERO_SLIDES } from 'constants/hero';
import { SECTION_IDS } from 'constants/routes';
import useSlideshow from 'hooks/useSlideshow';
import { heroBackdrop, heroPlaceholders } from 'themes/theme/default';
import { appear, entrance } from 'utils/animations';
import { onDark, overlay } from 'utils/colorUtils';
import { buildWhatsappUrl } from 'utils/links';
import { scrollToSection } from 'utils/scroll';

// assets
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ImageIcon } from 'assets/icons';

// o autoplay só para enquanto a pessoa está usando as setas ou os indicadores
const pauseHandlers = (setPaused: (paused: boolean) => void) => ({
  onMouseEnter: () => setPaused(true),
  onMouseLeave: () => setPaused(false),
  onFocus: () => setPaused(true),
  onBlur: () => setPaused(false)
});

// seta circular do slideshow (somente no desktop, como no design)
function SlideArrow({
  side,
  label,
  onClick,
  setPaused,
  children
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
  setPaused: (paused: boolean) => void;
  children: ReactNode;
}) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      {...pauseHandlers(setPaused)}
      sx={(theme: Theme) => ({
        position: 'absolute',
        top: '50%',
        [side]: 56,
        transform: 'translateY(-50%)',
        display: { xs: 'none', md: 'inline-flex' },
        width: 48,
        height: 48,
        border: `1px solid ${onDark(theme, 0.6)}`,
        color: 'common.white',
        '&:hover': { backgroundColor: onDark(theme, 0.12) },
        ...entrance(1200, appear, 800)
      })}
    >
      {children}
    </IconButton>
  );
}

// ==============================|| LANDING - HERO PAGE ||============================== //

export default function Hero() {
  const intl = useIntl();
  const { index, next, prev, goTo, setPaused } = useSlideshow(HERO_SLIDES.length, HERO_AUTOPLAY_MS);
  const showPlaceholderHint = HERO_SLIDES.some((slide) => !slide.image);

  useEffect(() => {
    HERO_SLIDES.forEach(({ image }) => {
      if (image) new Image().src = image;
    });
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        '@supports (height: 100svh)': { height: '100svh' },
        minHeight: { xs: 620, md: 660 },
        bgcolor: heroBackdrop,
        color: 'common.white'
      }}
    >
      {/* fotos do casal (slideshow) com véu escuro por cima */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
        {HERO_SLIDES.map((slide, slideIndex) => (
          <Box
            key={slideIndex}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: slideIndex === index ? 1 : 0,
              transition: 'opacity 900ms ease',
              backgroundImage: slide.image ? `url("${slide.image}")` : heroPlaceholders[slideIndex % heroPlaceholders.length],
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
      </Box>
      <Box aria-hidden sx={(theme) => ({ position: 'absolute', inset: 0, bgcolor: overlay(theme, 0.3) })} />

      {/* texto principal */}
      <Stack sx={{ position: 'relative', zIndex: 1, alignItems: 'center', textAlign: 'center', px: 3, gap: { xs: '18px', md: '20px' } }}>
        <Typography
          variant="subtitle2"
          component="p"
          sx={(theme) => ({
            color: onDark(theme, 0.9),
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            letterSpacing: { xs: '0.22em', md: '0.24em' },
            ...entrance(200)
          })}
        >
          <SafeFormattedMessage id="landing.hero.eyebrow" />
        </Typography>

        {/* nomes em duas linhas: "Luarnderson" / "& Paty". A 1ª linha tem a largura do "Ana & Lucas" do design (~5 em), então o
            bloco ocupa o mesmo espaço; o tamanho acompanha a largura da tela (mobile) ou a altura (desktop) para nunca estourar */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            color: 'common.white',
            fontSize: { xs: 'min(4.25rem, calc((100vw - 48px) / 5.03))', md: 'min(8rem, 15svh)' },
            lineHeight: { xs: 0.95, md: 0.92 }
          }}
        >
          <Box component="span" sx={{ display: 'block', ...entrance(350) }}>
            {COUPLE.first}
          </Box>{' '}
          <Box component="span" sx={{ display: 'block', ...entrance(500) }}>
            <Box component="span" sx={{ mr: '0.12em', fontStyle: 'italic', fontWeight: 400 }}>
              &amp;
            </Box>
            {COUPLE.second}
          </Box>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            maxWidth: { xs: 310, md: 560 },
            color: onDark(theme, 0.92),
            fontSize: { xs: '1rem', md: '1.25rem' },
            lineHeight: 1.5,
            ...entrance(700)
          })}
        >
          <SafeFormattedMessage id="landing.hero.description" />
        </Typography>

        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: { xs: 1, md: '10px' }, pt: { xs: '4px', md: 1 }, pb: { xs: 0, md: '4px' }, ...entrance(850) }}
        >
          <Box component="span" sx={{ display: 'flex', '& svg': { width: { xs: 18, md: 20 }, height: { xs: 18, md: 20 } } }}>
            <CalendarIcon />
          </Box>
          <Typography component="span" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' }, lineHeight: 1.302 }}>
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              <SafeFormattedMessage id="landing.hero.date.long" />
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
              <SafeFormattedMessage id="landing.hero.date.short" />
            </Box>
          </Typography>
        </Stack>

        <Stack
          sx={{
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '12px', md: 2 },
            pt: { xs: '14px', md: 2 },
            ...entrance(1000)
          }}
        >
          <Button
            variant="contained"
            color="light"
            component={RouterLink}
            to={{ hash: SECTION_IDS.GIFTS }}
            onClick={() => scrollToSection(SECTION_IDS.GIFTS)}
          >
            <SafeFormattedMessage id="landing.hero.cta.gifts" />
          </Button>
          <Button
            variant="outlined"
            color="light"
            href={buildWhatsappUrl(CONTACT.whatsappNumber, intl.formatMessage({ id: 'landing.hero.rsvpMessage' }, { names: COUPLE.names }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SafeFormattedMessage id="landing.hero.cta.rsvp" />
          </Button>
        </Stack>
      </Stack>

      {/* controles do slideshow */}
      <SlideArrow side="left" label={intl.formatMessage({ id: 'landing.hero.slide.previous' })} onClick={prev} setPaused={setPaused}>
        <ArrowLeftIcon />
      </SlideArrow>
      <SlideArrow side="right" label={intl.formatMessage({ id: 'landing.hero.slide.next' })} onClick={next} setPaused={setPaused}>
        <ArrowRightIcon />
      </SlideArrow>

      <Stack
        direction="row"
        {...pauseHandlers(setPaused)}
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 44, md: 50 },
          transform: 'translateX(-50%)',
          gap: 1,
          alignItems: 'center',
          ...entrance(1200, appear, 800)
        }}
      >
        {HERO_SLIDES.map((_, slideIndex) => {
          const active = slideIndex === index;
          return (
            <ButtonBase
              key={slideIndex}
              onClick={() => goTo(slideIndex)}
              aria-label={intl.formatMessage({ id: 'landing.hero.slide.goTo' }, { index: slideIndex + 1 })}
              aria-current={active ? 'true' : undefined}
              sx={(theme) => ({
                position: 'relative',
                width: active ? 28 : 6,
                height: 6,
                borderRadius: '3px',
                bgcolor: active ? 'common.white' : onDark(theme, 0.5),
                transition: 'width 300ms ease, background-color 300ms ease',
                '&::after': { content: '""', position: 'absolute', inset: '-10px -4px' }
              })}
            />
          );
        })}
      </Stack>

      {/* dica de design: some sozinha quando houver fotos em src/assets/images/hero */}
      {showPlaceholderHint && (
        <Stack
          direction="row"
          sx={(theme) => ({
            position: 'absolute',
            left: 64,
            bottom: 37,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            color: onDark(theme, 0.75),
            ...entrance(1300, appear, 800)
          })}
        >
          <Box component="span" sx={{ display: 'flex', opacity: 0.75, '& svg': { width: 16, height: 16 } }}>
            <ImageIcon />
          </Box>
          <Typography variant="caption" sx={{ color: 'inherit' }}>
            <SafeFormattedMessage id="landing.hero.slide.hint" values={{ current: index + 1, total: HERO_SLIDES.length }} />
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
