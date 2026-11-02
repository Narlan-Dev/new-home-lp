// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { SECTION_IDS } from 'constants/routes';
import { SCHEDULE } from 'constants/schedule';

// ==============================|| LANDING - SCHEDULE PAGE ||============================== //

export default function Schedule() {
  return (
    <Section id={SECTION_IDS.SCHEDULE}>
      <SectionHeader
        eyebrow={<SafeFormattedMessage id="landing.schedule.eyebrow" />}
        title={<SafeFormattedMessage id="landing.schedule.title" />}
        description={<SafeFormattedMessage id="landing.schedule.description" />}
      />

      {/* linha do tempo: cada item sobe em sequência, o marcador "estoura" e a linha até o próximo horário se desenha */}
      <Box component="ol" sx={{ listStyle: 'none', m: '0 auto', p: 0, pt: { xs: '44px', md: 8 }, maxWidth: 760 }}>
        {SCHEDULE.map(({ id, time }, index) => {
          const isLast = index === SCHEDULE.length - 1;

          return (
            <Reveal key={id} component="li" distance={24} group="schedule" stagger={120} sx={{ display: 'flex', gap: { xs: 2, md: 4 } }}>
              <Typography
                variant="h3"
                component="time"
                sx={{
                  width: { xs: 70, md: 110 },
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                  fontSize: { xs: '1.75rem', md: '2.375rem' },
                  lineHeight: { xs: 1.1, md: 1 },
                  color: 'primary.main'
                }}
              >
                {time}
              </Typography>

              <Box
                aria-hidden
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, pt: { xs: '10px', md: '12px' } }}
              >
                <Reveal
                  variant="pop"
                  duration={600}
                  delay={300}
                  group="schedule-dots"
                  stagger={120}
                  sx={{ width: { xs: 10, md: 12 }, height: { xs: 10, md: 12 }, borderRadius: '50%', bgcolor: 'secondary.main' }}
                />
                {!isLast && (
                  <Reveal
                    variant="draw-y"
                    duration={900}
                    delay={500}
                    group="schedule-lines"
                    stagger={120}
                    sx={{ flex: 1, width: '1px', bgcolor: 'divider' }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0, pt: { xs: '2px', md: '4px' }, pb: isLast ? 0 : { xs: 4, md: '44px' } }}>
                <Typography variant="h6" component="h3">
                  <SafeFormattedMessage id={`landing.schedule.items.${id}.title`} />
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: { xs: '4px', md: '6px' }, color: 'text.secondary', lineHeight: { xs: 1.5, md: 1.55 } }}
                >
                  <SafeFormattedMessage id={`landing.schedule.items.${id}.description`} />
                </Typography>
              </Box>
            </Reveal>
          );
        })}
      </Box>
    </Section>
  );
}
