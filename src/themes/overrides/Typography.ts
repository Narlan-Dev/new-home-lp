// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //

// `subtitle1` (texto de apoio) e `subtitle2` (eyebrow) são parágrafos no design; por padrão o MUI os renderizaria como <h6>
export default function Typography() {
  return {
    MuiTypography: {
      defaultProps: {
        variantMapping: { subtitle1: 'p', subtitle2: 'p' }
      }
    }
  };
}
