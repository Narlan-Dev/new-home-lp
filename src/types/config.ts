export type I18n = 'pt-br'; // 'pt-br' - Portuguese (Brazil)

// ==============================|| TYPES - CONFIG ||============================== //

export interface ConfigStates {
  /**
   * The props used for the theme body font-family (CSS font-family value).
   */
  fontFamily: string;

  /**
   * The props used for the theme display font-family (headings, CSS font-family value).
   */
  fontFamilyDisplay: string;

  /**
   * The props used for display text with multi-language, according to 'react-intl'.
   * Each language has its own file in `src/utils/locales`.
   * 'pt-br' (default)
   */
  i18n: I18n;
}
