// material-ui
import { alpha, Theme } from '@mui/material/styles';

// ==============================|| CUSTOM FUNCTION - WITH ALPHA ||============================== //

/** branco com opacidade, para textos e bordas sobre fundos escuros */
export const onDark = (theme: Theme, opacity: number) => alpha(theme.palette.common.white, opacity);

/** véu escuro (#111a2e) com opacidade, usado sobre as fotos do hero */
export const overlay = (theme: Theme, opacity: number) => alpha(theme.palette.common.overlay, opacity);
