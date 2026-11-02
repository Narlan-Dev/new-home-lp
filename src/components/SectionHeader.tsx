import { ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Reveal from 'components/Reveal';

interface SectionHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** texto claro, para seções de fundo escuro */
  inverted?: boolean;
  /** largura máxima do texto de apoio em px (padrão do design: 330 no mobile e 560 no desktop) */
  descriptionMaxWidth?: { xs: number; md: number };
  /** ajustes pontuais no título (ex.: tamanho menor no mobile) */
  titleSx?: SxProps<Theme>;
}

// ==============================|| COMPONENT: SECTION HEADER ||============================== //

// cabeçalho centralizado das seções: eyebrow, título e texto de apoio, que entram em cascata
export default function SectionHeader({
  eyebrow,
  title,
  description,
  inverted = false,
  descriptionMaxWidth = { xs: 330, md: 560 },
  titleSx
}: SectionHeaderProps) {
  return (
    <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: { xs: '14px', md: 2 } }}>
      <Reveal>
        <Typography variant="subtitle2" component="p" sx={{ color: inverted ? 'common.white' : 'secondary.main' }}>
          {eyebrow}
        </Typography>
      </Reveal>
      <Reveal delay={100}>
        <Typography
          variant="h2"
          component="h2"
          sx={[{ maxWidth: 800, color: inverted ? 'common.white' : 'text.primary' }, ...(Array.isArray(titleSx) ? titleSx : [titleSx])]}
        >
          {title}
        </Typography>
      </Reveal>
      {description && (
        <Reveal delay={200}>
          <Typography variant="subtitle1" sx={{ maxWidth: descriptionMaxWidth, color: inverted ? 'common.white' : 'text.secondary' }}>
            {description}
          </Typography>
        </Reveal>
      )}
    </Stack>
  );
}
