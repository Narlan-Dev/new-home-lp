import { ComponentType, Fragment } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { COUPLE, EVENT } from 'constants/event';
import { SECTION_IDS } from 'constants/routes';
import { buildIcs, downloadTextFile } from 'utils/calendar';
import { buildMapsUrl } from 'utils/links';

// assets
import { CalendarIcon, ClockIcon, IconProps, PinIcon } from 'assets/icons';

const infoItems: { key: 'date' | 'time' | 'place'; Icon: ComponentType<IconProps> }[] = [
  { key: 'date', Icon: CalendarIcon },
  { key: 'time', Icon: ClockIcon },
  { key: 'place', Icon: PinIcon }
];

// linha divisória que "se desenha": horizontal no mobile (entre os itens) e vertical entre as colunas no desktop
function InfoDivider({ desktop = true }: { desktop?: boolean }) {
  return (
    <>
      <Reveal
        aria-hidden
        variant="draw-x"
        duration={900}
        delay={150}
        group="event-dividers"
        stagger={140}
        sx={{ display: { xs: 'block', md: 'none' }, height: '1px', bgcolor: 'divider' }}
      />
      {desktop && (
        <Reveal
          aria-hidden
          variant="draw-y"
          duration={900}
          delay={150}
          group="event-dividers"
          stagger={140}
          sx={{ display: { xs: 'none', md: 'block' }, width: '1px', alignSelf: 'stretch', bgcolor: 'divider' }}
        />
      )}
    </>
  );
}

// ==============================|| LANDING - EVENT INFO PAGE ||============================== //

export default function EventInfo() {
  const intl = useIntl();

  const handleAddToCalendar = () => {
    const ics = buildIcs({
      title: intl.formatMessage({ id: 'landing.event.calendar.title' }, { names: COUPLE.names }),
      description: intl.formatMessage({ id: 'landing.event.calendar.description' }),
      location: `${intl.formatMessage({ id: 'landing.event.place.value' })} — ${EVENT.address}`,
      startsAt: EVENT.startsAt,
      endsAt: EVENT.endsAt
    });
    downloadTextFile('cha-de-casa-nova.ics', ics, 'text/calendar;charset=utf-8');
  };

  return (
    <Section id={SECTION_IDS.EVENT} sx={{ py: { xs: 9, md: 14 } }}>
      <SectionHeader
        eyebrow={<SafeFormattedMessage id="landing.event.eyebrow" />}
        title={<SafeFormattedMessage id="landing.event.title" />}
        description={<SafeFormattedMessage id="landing.event.description" />}
      />

      {/* data, hora e local: 3 colunas separadas por linhas no desktop, lista empilhada no mobile */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, pt: { xs: 5, md: 8 } }}>
        {infoItems.map(({ key, Icon }, index) => (
          <Fragment key={key}>
            <InfoDivider desktop={index > 0} />
            <Reveal group="event-columns" stagger={140} delay={100} sx={{ flex: 1 }}>
              <Stack
                sx={{
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: { xs: '10px', md: '12px' },
                  px: { xs: 0, md: 4 },
                  py: { xs: '28px', md: 1 }
                }}
              >
                <Reveal variant="pop" duration={700} delay={350} group="event-icons" stagger={140}>
                  <Box component="span" sx={{ display: 'flex', '& svg': { width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } } }}>
                    <Icon />
                  </Box>
                </Reveal>
                <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
                  <SafeFormattedMessage id={`landing.event.${key}.label`} />
                </Typography>
                <Typography variant="h3" component="p">
                  <SafeFormattedMessage id={`landing.event.${key}.value`} />
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.302 }}>
                  <SafeFormattedMessage id={`landing.event.${key}.detail`} />
                </Typography>
              </Stack>
            </Reveal>
          </Fragment>
        ))}
        <InfoDivider desktop={false} />
      </Box>

      <Reveal delay={150}>
        <Stack
          sx={{
            pt: { xs: 4, md: 7 },
            gap: { xs: '12px', md: 2 },
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: { xs: 'stretch', md: 'flex-start' }
          }}
        >
          <Button variant="contained" onClick={handleAddToCalendar}>
            <SafeFormattedMessage id="landing.event.cta.calendar" />
          </Button>
          <Button variant="outlined" href={buildMapsUrl(EVENT.address)} target="_blank" rel="noopener noreferrer">
            <SafeFormattedMessage id="landing.event.cta.map" />
          </Button>
        </Stack>
      </Reveal>
    </Section>
  );
}
