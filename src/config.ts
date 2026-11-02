// types
import { ConfigStates } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const CSS_VAR_PREFIX = '';

// `md` separa o layout mobile (frame 390) do layout desktop (frame 1440) do design
export const BREAKPOINTS = { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1440 };

// ==============================|| THEME CONFIG ||============================== //

const config: ConfigStates = {
  fontFamily: `'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  fontFamilyDisplay: `'Cormorant Garamond', Georgia, 'Times New Roman', serif`,
  i18n: 'pt-br'
};

export default config;
