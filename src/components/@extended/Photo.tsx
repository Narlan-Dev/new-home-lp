import { ReactNode, useState } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project-imports
import { ImageIcon } from 'assets/icons';

interface PhotoProps {
  /** foto real; sem ela (ou se o link não carregar) aparece o placeholder do design: fundo azulado com o ícone de imagem */
  src?: string;
  alt: string;
  /** tamanho do ícone do placeholder, em px (aceita valores por breakpoint) */
  iconSize?: number | { xs: number; md: number };
  /** legenda exibida abaixo do ícone no placeholder */
  caption?: ReactNode;
  /** chamado quando o link da foto não carrega */
  onLoadError?: () => void;
  sx?: SxProps<Theme>;
}

// ==============================|| COMPONENT: PHOTO ||============================== //

export default function Photo({ src, alt, iconSize = 40, caption, onLoadError, sx }: PhotoProps) {
  // guarda o link que falhou: se ele for trocado por outro, a foto tenta carregar de novo
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = Boolean(src) && src !== failedSrc;

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
      {showImage ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          // os links são de lojas de terceiros: não revela o endereço do site e escapa de bloqueios de "hotlink"
          referrerPolicy="no-referrer"
          onError={() => {
            setFailedSrc(src);
            onLoadError?.();
          }}
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
