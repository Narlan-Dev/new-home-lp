import { ReactNode } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { CONTACT, PIX } from 'constants/contact';
import { COUPLE, EVENT } from 'constants/event';
import { SECTION_IDS } from 'constants/routes';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { onDark } from 'utils/colorUtils';
import { buildInstagramUrl, buildWhatsappUrl } from 'utils/links';

// assets
import { InstagramIcon, MailIcon, PhoneIcon, QrIcon } from 'assets/icons';

// cartão translúcido sobre o fundo azul escuro
const cardSx = (theme: Theme) => ({
  flex: 1,
  bgcolor: onDark(theme, 0.08),
  border: `1px solid ${onDark(theme, 0.2)}`,
  borderRadius: { xs: '20px', md: '24px' },
  p: { xs: '28px', md: 5 }
});

// chave Pix em e-mail: em telas estreitas quebra depois do "@" em vez de no meio de uma palavra
function BreakableKey({ value }: { value: string }) {
  const [user, ...domain] = value.split('@');
  if (!domain.length) return value;

  return (
    <>
      {user}@<wbr />
      {domain.join('@')}
    </>
  );
}

function ContactLine({ href, icon, children, external }: { href: string; icon: ReactNode; children: ReactNode; external?: boolean }) {
  return (
    <Reveal variant="right" distance={24} group="contact-lines" stagger={100} delay={250} sx={{ width: 'fit-content' }}>
      <Link
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: '14px', color: onDark(theme, 0.92), width: 'fit-content' })}
      >
        <Box component="span" sx={{ display: 'flex', flexShrink: 0 }}>
          {icon}
        </Box>
        <Typography component="span" sx={{ color: 'inherit', fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.302 }}>
          {children}
        </Typography>
      </Link>
    </Reveal>
  );
}

// ==============================|| LANDING - CONTRIBUTION & CONTACT PAGE ||============================== //

export default function Contact() {
  const intl = useIntl();
  const { copied, copy } = useCopyToClipboard();

  return (
    <Section id={SECTION_IDS.CONTACT} tone="dark" sx={{ pt: { xs: 9, md: 14 }, pb: { xs: '28px', md: 5 } }}>
      <SectionHeader
        inverted
        // neste bloco o design usa título de 40px e texto de apoio de 350px no mobile
        titleSx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, lineHeight: { xs: 1.02, md: 1 } }}
        descriptionMaxWidth={{ xs: 350, md: 560 }}
        eyebrow={<SafeFormattedMessage id="landing.contact.eyebrow" />}
        title={<SafeFormattedMessage id="landing.contact.title" />}
        description={<SafeFormattedMessage id="landing.contact.description" />}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 }, pt: { xs: 5, md: 8 } }}>
        {/* cartão Pix: QR code (placeholder do design) + chave + botão de copiar */}
        <Reveal group="contact-cards" stagger={160} delay={100} distance={36} sx={{ display: 'flex' }}>
          <Stack sx={[cardSx, { flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: '22px', md: 4 } }]}>
            <Reveal variant="pop" duration={800} delay={450} sx={{ flexShrink: 0 }}>
              <Box
                role="img"
                aria-label={intl.formatMessage({ id: 'landing.contact.pix.qr' })}
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: { xs: 160, md: 176 },
                  height: { xs: 160, md: 176 },
                  bgcolor: 'common.white',
                  borderRadius: '16px',
                  color: 'primary.main'
                }}
              >
                <Box component="span" sx={{ display: 'flex', '& svg': { width: { xs: 96, md: 104 }, height: { xs: 96, md: 104 } } }}>
                  <QrIcon />
                </Box>
              </Box>
            </Reveal>

            <Stack
              sx={{ flex: 1, minWidth: 0, gap: 1, alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}
            >
              <Typography variant="subtitle2" component="p" sx={(theme) => ({ color: onDark(theme, 0.7) })}>
                <SafeFormattedMessage id="landing.contact.pix.label" />
              </Typography>
              <Typography variant="h4" component="p" sx={{ color: 'common.white', overflowWrap: 'anywhere' }}>
                <BreakableKey value={PIX.key} />
              </Typography>
              <Typography
                variant="body2"
                sx={(theme) => ({ color: onDark(theme, 0.7), fontSize: { xs: '0.875rem', md: '0.875rem' }, lineHeight: 1.302 })}
              >
                {PIX.holder}
              </Typography>
              <Box sx={{ pt: { xs: '10px', md: '12px' } }}>
                <Button variant="contained" color="light" onClick={() => copy(PIX.key)} sx={{ minWidth: 186 }}>
                  <SafeFormattedMessage id={copied ? 'landing.contact.pix.copied' : 'landing.contact.pix.copy'} />
                </Button>
                <Box
                  component="span"
                  role="status"
                  sx={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    clipPath: 'inset(50%)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copied ? intl.formatMessage({ id: 'landing.contact.pix.copied' }) : ''}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Reveal>

        {/* cartão de contato */}
        <Reveal group="contact-cards" stagger={160} delay={100} distance={36} sx={{ display: 'flex' }}>
          <Stack sx={[cardSx, { gap: { xs: '20px', md: '22px' } }]}>
            <Typography variant="h4" component="h3" sx={{ color: 'common.white', lineHeight: 1.211 }}>
              <SafeFormattedMessage id="landing.contact.card.title" />
            </Typography>
            <ContactLine external href={buildWhatsappUrl(CONTACT.whatsappNumber)} icon={<PhoneIcon />}>
              <SafeFormattedMessage id="landing.contact.whatsapp" values={{ phone: CONTACT.phoneDisplay }} />
            </ContactLine>
            <ContactLine href={`mailto:${CONTACT.email}`} icon={<MailIcon />}>
              {CONTACT.email}
            </ContactLine>
            <ContactLine external href={buildInstagramUrl(CONTACT.instagram)} icon={<InstagramIcon />}>
              @{CONTACT.instagram}
            </ContactLine>
          </Stack>
        </Reveal>
      </Box>

      {/* créditos */}
      <Reveal variant="fade" duration={1000}>
        <Stack
          direction="row"
          sx={(theme) => ({
            justifyContent: 'space-between',
            gap: 2,
            mt: { xs: '44px', md: 7 },
            pt: { xs: '20px', md: 3 },
            borderTop: `1px solid ${onDark(theme, 0.15)}`,
            color: onDark(theme, 0.65)
          })}
        >
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            <SafeFormattedMessage
              id="landing.contact.credits.copyright"
              values={{ year: new Date(EVENT.startsAt).getFullYear(), names: COUPLE.names }}
            />
          </Typography>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            <SafeFormattedMessage id="landing.contact.credits.madeWith" />
          </Typography>
        </Stack>
      </Reveal>
    </Section>
  );
}
