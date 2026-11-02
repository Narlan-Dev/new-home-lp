// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import Photo from 'components/@extended/Photo';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { ABOUT_PHOTO, COUPLE } from 'constants/event';
import { SECTION_IDS } from 'constants/routes';

// ==============================|| LANDING - ABOUT PAGE ||============================== //

export default function About() {
  const intl = useIntl();
  const photoAlt = intl.formatMessage({ id: 'landing.about.photo' });

  return (
    <Section id={SECTION_IDS.ABOUT} tone="soft" sx={{ py: { xs: 9, md: 16 } }}>
      <Box
        sx={{
          display: 'grid',
          // 520:584 reproduz o desktop do design (foto + texto) e escala proporcionalmente abaixo de 1200px
          gridTemplateColumns: { xs: '1fr', md: '520fr 584fr' },
          columnGap: { md: 6, lg: 12 },
          rowGap: '36px',
          alignItems: 'center'
        }}
      >
        {/* foto em arco (raio horizontal de 50% e vertical de metade da largura, mantendo o círculo na proporção do design)
            que sobe revelando-se como uma cortina */}
        <Reveal
          variant="curtain"
          duration={1200}
          sx={{
            width: '100%',
            maxWidth: { xs: 350, md: 'none' },
            mx: { xs: 'auto', md: 0 },
            aspectRatio: { xs: '350 / 440', md: '520 / 640' },
            borderRadius: { xs: '50% 50% 20px 20px / 39.77% 39.77% 20px 20px', md: '50% 50% 24px 24px / 40.625% 40.625% 24px 24px' }
          }}
        >
          <Photo
            src={ABOUT_PHOTO}
            alt={photoAlt}
            iconSize={{ xs: 40, md: 48 }}
            caption={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {photoAlt}
              </Typography>
            }
            sx={{ width: '100%', height: '100%', gap: { xs: '10px', md: 1.5 }, borderRadius: 'inherit' }}
          />
        </Reveal>

        <Stack sx={{ gap: { xs: '20px', md: 3 } }}>
          <Reveal>
            <Typography variant="subtitle2" component="p" sx={{ color: 'secondary.main' }}>
              <SafeFormattedMessage id="landing.about.eyebrow" />
            </Typography>
          </Reveal>
          <Reveal delay={100}>
            <Typography variant="h2" component="h2">
              <SafeFormattedMessage id="landing.about.title" />
            </Typography>
          </Reveal>
          <Reveal delay={200}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
              <SafeFormattedMessage id="landing.about.paragraph1" />
            </Typography>
          </Reveal>
          <Reveal delay={300}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
              <SafeFormattedMessage id="landing.about.paragraph2" />
            </Typography>
          </Reveal>
          <Reveal delay={450}>
            <Typography
              variant="h4"
              component="p"
              sx={{ color: 'primary.main', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.211, textWrap: 'balance' }}
            >
              <SafeFormattedMessage id="landing.about.signature" values={{ names: COUPLE.names }} />
            </Typography>
          </Reveal>
        </Stack>
      </Box>
    </Section>
  );
}
