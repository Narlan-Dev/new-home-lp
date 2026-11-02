// material-ui
import { keyframes } from '@mui/material/styles';

// curva de desaceleração suave usada em todas as entradas
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const rise = keyframes`
  from { opacity: 0; transform: translate3d(0, 28px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

// ==============================|| UTILS - ANIMATIONS ||============================== //

/** entrada por keyframes ao carregar (usada no hero); desligada para quem prefere menos movimento */
export const entrance = (delay: number, animation = rise, duration = 1000) => ({
  animation: `${animation} ${duration}ms ${EASE_OUT} ${delay}ms both`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
});
