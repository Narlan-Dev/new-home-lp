import { ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface SectionProps {
  id?: string;
  /** fundo da seção: branco, cinza claro (alternado) ou azul escuro */
  tone?: 'default' | 'soft' | 'dark';
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const toneBackground = { default: 'background.default', soft: 'background.soft', dark: 'primary.main' } as const;

// ==============================|| COMPONENT: SECTION ||============================== //

// seção de largura total com o conteúdo limitado a 1200px (120px de respiro lateral no frame de 1440)
export default function Section({ id, tone = 'default', children, sx }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={[
        { bgcolor: toneBackground[tone], px: { xs: '20px', sm: '40px', md: '64px', lg: '120px' }, py: { xs: 9, md: 16 } },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>{children}</Box>
    </Box>
  );
}
