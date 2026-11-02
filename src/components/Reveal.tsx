import { ElementType, HTMLAttributes, ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project-imports
import useInView from 'hooks/useInView';
import { EASE_OUT } from 'utils/animations';

/**
 * Tipos de entrada:
 * - fade: só aparece · up: sobe aparecendo · left/right: entra deslizando pelo lado
 * - scale: cresce de leve · pop: "estoura" com leve overshoot (ícones e marcadores)
 * - draw-x / draw-y: a linha se desenha na horizontal / vertical · curtain: revela de baixo para cima (fotos)
 */
export type RevealVariant = 'fade' | 'up' | 'left' | 'right' | 'scale' | 'pop' | 'draw-x' | 'draw-y' | 'curtain';

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children?: ReactNode;
  variant?: RevealVariant;
  /** atraso em ms */
  delay?: number;
  /** duração em ms */
  duration?: number;
  /** deslocamento inicial (px) de `up`, `left` e `right` */
  distance?: number;
  /** elementos do mesmo grupo que aparecem juntos entram em sequência (`stagger` ms entre cada um) */
  group?: string;
  stagger?: number;
  component?: ElementType;
  sx?: SxProps<Theme>;
}

type Styles = Record<string, string | number>;

const hiddenStyles: Record<RevealVariant, (distance: number) => Styles> = {
  fade: () => ({ opacity: 0 }),
  up: (distance) => ({ opacity: 0, transform: `translate3d(0, ${distance}px, 0)` }),
  left: (distance) => ({ opacity: 0, transform: `translate3d(${-distance}px, 0, 0)` }),
  right: (distance) => ({ opacity: 0, transform: `translate3d(${distance}px, 0, 0)` }),
  scale: () => ({ opacity: 0, transform: 'scale(0.94)' }),
  pop: () => ({ opacity: 0, transform: 'scale(0.6)' }),
  'draw-x': () => ({ transform: 'scaleX(0)', transformOrigin: 'left center' }),
  'draw-y': () => ({ transform: 'scaleY(0)', transformOrigin: 'center top' }),
  curtain: () => ({ clipPath: 'inset(100% 0 0 0)' })
};

const shownStyles: Record<RevealVariant, Styles> = {
  fade: { opacity: 1 },
  up: { opacity: 1, transform: 'none' },
  left: { opacity: 1, transform: 'none' },
  right: { opacity: 1, transform: 'none' },
  scale: { opacity: 1, transform: 'none' },
  pop: { opacity: 1, transform: 'none' },
  'draw-x': { transform: 'none' },
  'draw-y': { transform: 'none' },
  curtain: { clipPath: 'inset(0 0 0 0)' }
};

const animatedProperties: Record<RevealVariant, string[]> = {
  fade: ['opacity'],
  up: ['opacity', 'transform'],
  left: ['opacity', 'transform'],
  right: ['opacity', 'transform'],
  scale: ['opacity', 'transform'],
  pop: ['opacity', 'transform'],
  'draw-x': ['transform'],
  'draw-y': ['transform'],
  curtain: ['clip-path']
};

// curva com leve overshoot para o `pop`
const POP_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// ==============================|| COMPONENT: REVEAL ||============================== //

// anima a entrada do conteúdo quando ele aparece na tela (uma vez); sem animação para quem prefere menos movimento
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 800,
  distance = 28,
  group,
  stagger = 0,
  component = 'div',
  sx,
  ...rest
}: RevealProps) {
  const { ref, visible, order } = useInView<HTMLElement>(group);
  const easing = variant === 'pop' ? POP_EASE : EASE_OUT;
  const totalDelay = delay + order * stagger;

  return (
    <Box
      ref={ref}
      component={component}
      data-reveal={visible ? 'visible' : 'hidden'}
      sx={[
        {
          transition: animatedProperties[variant].map((property) => `${property} ${duration}ms ${easing} ${totalDelay}ms`).join(', '),
          ...(visible ? shownStyles[variant] : hiddenStyles[variant](distance)),
          '@media (prefers-reduced-motion: reduce)': { ...shownStyles[variant], transition: 'none' }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}
