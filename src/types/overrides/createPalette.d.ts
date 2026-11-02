// eslint-disable-next-line
import * as createPalette from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    light: PaletteColor;
  }

  interface PaletteOptions {
    light?: PaletteColorOptions;
  }

  interface TypeBackground {
    soft: string;
    media: string;
  }

  interface CommonColors {
    overlay: string;
  }
}
