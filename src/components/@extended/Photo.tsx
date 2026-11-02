import { ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project-imports
import { ImageIcon } from 'assets/icons';

interface PhotoProps {
  /** foto real; sem ela aparece o placeholder do design (fundo azulado com o ícone de imagem) */
  src?: string;
  alt: string;
  /** tamanho do ícone do placeholder, em px (aceita valores por breakpoint) */
  iconSize?: number | { xs: number; md: number };
  /** legenda exibida abaixo do ícone no placeholder */
  caption?: ReactNode;
  sx?: SxProps<Theme>;
}

// ==============================|| COMPONENT: PHOTO ||============================== //

export default function Photo({ src, alt, iconSize = 40, caption, sx }: PhotoProps) {
  return (
    <Box
      sx={[
        {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          overflow: 'hidden',
          bgcolor: 'background.media',
          color: 'secondary.main'
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <>
          <Box component="span" sx={{ display: 'flex', '& svg': { width: iconSize, height: iconSize } }}>
            <ImageIcon />
          </Box>
          {caption}
        </>
      )}
    </Box>
  );
}
