import { useState } from 'react';
import { Link as RouterLink } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { COUPLE } from 'constants/event';
import { ROUTES, SECTION_IDS } from 'constants/routes';
import { appear, entrance } from 'utils/animations';
import { onDark } from 'utils/colorUtils';
import { scrollToSection } from 'utils/scroll';

// assets
import { CloseIcon, MenuIcon } from 'assets/icons';

const navLinks = [
  { id: SECTION_IDS.EVENT, labelId: 'header.nav.event' },
  { id: SECTION_IDS.ABOUT, labelId: 'header.nav.about' },
  { id: SECTION_IDS.SCHEDULE, labelId: 'header.nav.schedule' },
  { id: SECTION_IDS.GIFTS, labelId: 'header.nav.gifts' },
  { id: SECTION_IDS.FAQ, labelId: 'header.nav.faq' }
];

// ==============================|| COMMON HEADER COMPONENT ||============================== //

// barra de navegação sobre o hero: logo à esquerda e links à direita (menu em gaveta no mobile)
export default function Header() {
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: '20px', md: '64px' },
        py: { xs: 3, md: '36px' },
        color: 'common.white',
        ...entrance(100, appear)
      }}
    >
      <Link
        component={RouterLink}
        to={ROUTES.HOME}
        underline="none"
        aria-label={intl.formatMessage({ id: 'header.logo' }, { names: COUPLE.names })}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{ color: 'common.white' }}
      >
        <Typography
          component="span"
          variant="h2"
          // o h2 define line-height também em `md`; por isso o override precisa informar os dois breakpoints
          sx={{ display: 'block', fontSize: { xs: '1.75rem', md: '2rem' }, lineHeight: { xs: 1.211, md: 1.211 }, color: 'inherit' }}
        >
          {COUPLE.initials}
        </Typography>
      </Link>

      <Stack
        component="nav"
        direction="row"
        aria-label={intl.formatMessage({ id: 'header.nav.label' })}
        sx={{ display: { xs: 'none', md: 'flex' }, gap: '40px' }}
      >
        {navLinks.map(({ id, labelId }) => (
          <Link
            key={id}
            component={RouterLink}
            to={{ hash: id }}
            onClick={() => handleNavigate(id)}
            sx={(theme) => ({ color: onDark(theme, 0.92), fontSize: '0.9375rem', lineHeight: 1.302, '&:hover': { color: 'common.white' } })}
          >
            <SafeFormattedMessage id={labelId} />
          </Link>
        ))}
      </Stack>

      <IconButton
        aria-label={intl.formatMessage({ id: 'header.menu.open' })}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(true)}
        sx={{ display: { xs: 'inline-flex', md: 'none' }, p: 0, color: 'common.white' }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          paper: { id: 'mobile-menu', sx: { width: 'min(320px, 85vw)', bgcolor: 'primary.main', color: 'common.white', p: 3 } }
        }}
      >
        <Stack sx={{ alignItems: 'flex-end' }}>
          <IconButton
            aria-label={intl.formatMessage({ id: 'header.menu.close' })}
            onClick={() => setMenuOpen(false)}
            sx={{ color: 'common.white' }}
          >
            <CloseIcon size={24} />
          </IconButton>
        </Stack>
        <Stack component="nav" aria-label={intl.formatMessage({ id: 'header.nav.label' })} sx={{ mt: 3, gap: 3 }}>
          {navLinks.map(({ id, labelId }) => (
            <Link
              key={id}
              component={RouterLink}
              to={{ hash: id }}
              underline="none"
              onClick={() => handleNavigate(id)}
              sx={{ color: 'common.white' }}
            >
              <Typography variant="h4" component="span" sx={{ fontSize: { xs: '1.875rem', md: '1.875rem' } }}>
                <SafeFormattedMessage id={labelId} />
              </Typography>
            </Link>
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
}
