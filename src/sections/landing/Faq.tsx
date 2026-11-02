// material-ui
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Reveal from 'components/Reveal';
import Section from 'components/Section';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { CONTACT } from 'constants/contact';
import { COUPLE } from 'constants/event';
import { FAQ_ITEMS } from 'constants/faq';
import { SECTION_IDS } from 'constants/routes';
import { buildWhatsappUrl } from 'utils/links';

// assets
import { PlusIcon } from 'assets/icons';

// ==============================|| LANDING - FAQ PAGE ||============================== //

export default function Faq() {
  const intl = useIntl();

  return (
    <Section id={SECTION_IDS.FAQ}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr', lg: '380px 1fr' },
          columnGap: { md: 6, lg: 12 },
          rowGap: '36px',
          alignItems: 'start'
        }}
      >
        <Stack sx={{ gap: { xs: 2, md: '20px' } }}>
          <Reveal>
            <Typography variant="subtitle2" component="p" sx={{ color: 'secondary.main' }}>
              <SafeFormattedMessage id="landing.faq.eyebrow" />
            </Typography>
          </Reveal>
          <Reveal delay={100}>
            <Typography variant="h2" component="h2">
              <SafeFormattedMessage id="landing.faq.title" />
            </Typography>
          </Reveal>
          <Reveal delay={200}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <SafeFormattedMessage id="landing.faq.description" />
            </Typography>
          </Reveal>
          <Reveal delay={300} sx={{ pt: { xs: 1, md: '12px' } }}>
            <Button
              variant="contained"
              href={buildWhatsappUrl(
                CONTACT.whatsappNumber,
                intl.formatMessage({ id: 'landing.faq.whatsappMessage' }, { names: COUPLE.names })
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SafeFormattedMessage id="landing.faq.cta" />
            </Button>
          </Reveal>
        </Stack>

        {/* o design mostra todas as respostas abertas; cada item pode ser recolhido/aberto. As perguntas entram em cascata. */}
        <Box>
          {FAQ_ITEMS.map((id) => (
            <Reveal key={id} group="faq" stagger={100} delay={150} distance={24}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<PlusIcon />} aria-controls={`faq-${id}-content`} id={`faq-${id}-header`}>
                  {/* altura de linha em px: o Figma arredonda a caixa do texto (28,6 -> 29), e isso se acumula nos 5 itens */}
                  <Typography variant="h5" component="span" sx={{ display: 'block', lineHeight: { xs: '24px', md: '29px' } }}>
                    <SafeFormattedMessage id={`landing.faq.items.${id}.question`} />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id={`faq-${id}-content`}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: { xs: '24px', md: '26px' } }}>
                    <SafeFormattedMessage id={`landing.faq.items.${id}.answer`} />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Reveal>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
