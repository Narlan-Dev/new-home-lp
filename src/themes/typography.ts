// material-ui
import { TypographyVariantsOptions } from '@mui/material/styles';

// project-imports
import { BREAKPOINTS } from 'config';

// valores de mobile (frame 390) por padrão; a partir de `md` valem os do desktop (frame 1440)
const mdUp = `@media (min-width:${BREAKPOINTS.md}px)`;

// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

export default function Typography(fontFamily: string, fontFamilyDisplay: string): TypographyVariantsOptions {
  return {
    htmlFontSize: 16,
    fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    // título do hero
    h1: {
      fontFamily: fontFamilyDisplay,
      fontWeight: 500,
      fontSize: '4.25rem',
      lineHeight: 0.92,
      [mdUp]: { fontSize: '8rem', lineHeight: 0.9 }
    },
    // título das seções
    h2: {
      fontFamily: fontFamilyDisplay,
      fontWeight: 500,
      fontSize: '2.75rem',
      lineHeight: 1.02,
      [mdUp]: { fontSize: '3.75rem', lineHeight: 1 }
    },
    // valores em destaque (data, hora, local)
    h3: { fontFamily: fontFamilyDisplay, fontWeight: 500, fontSize: '2.375rem', lineHeight: 1, [mdUp]: { fontSize: '2.75rem' } },
    // chave Pix, "Fale com a gente" e assinatura
    h4: { fontFamily: fontFamilyDisplay, fontWeight: 500, fontSize: '1.875rem', lineHeight: 1.05, [mdUp]: { fontSize: '2.125rem' } },
    // nome do presente e perguntas do FAQ
    h5: { fontFamily: fontFamilyDisplay, fontWeight: 500, fontSize: '1.375rem', lineHeight: 1.1, [mdUp]: { fontSize: '1.625rem' } },
    // título dos itens da programação
    h6: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.302, [mdUp]: { fontSize: '1.25rem' } },
    // texto de apoio sob os títulos
    subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.55, [mdUp]: { fontSize: '1.125rem' } },
    // eyebrow das seções
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: 1.302,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      [mdUp]: { fontSize: '0.8125rem', letterSpacing: '0.24em' }
    },
    body1: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.5, [mdUp]: { fontSize: '1rem' } },
    body2: { fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.302, [mdUp]: { fontSize: '0.875rem' } },
    caption: { fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.302 },
    button: { fontWeight: 500, fontSize: '0.9375rem', lineHeight: '20px', letterSpacing: '0.02em', textTransform: 'none' }
  };
}
