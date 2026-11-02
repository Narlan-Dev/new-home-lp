// ==============================|| PRESET THEME - DEFAULT ||============================== //

// tokens de cor extraídos do design do Figma (arquivo kZXVLomBUH1YbLtjfu9eJi)
export const colors = {
  white: '#ffffff',
  navy: '#2f3e5c', // botões escuros, preços, seção de contato
  ink: '#1b2438', // títulos e rótulos
  slate: '#5f6b80', // textos de apoio
  accent: '#5e7399', // eyebrows, ícones e marcadores
  placeholder: '#8a94a6', // placeholder dos campos
  divider: '#dde3ee', // divisores e bordas dos cards
  inputBorder: '#c5cedd', // borda dos campos e do checkbox
  media: '#dee4ee', // fundo dos placeholders de foto
  soft: '#f3f5f9', // fundo das seções alternadas
  overlay: '#111a2e' // véu sobre as fotos do hero e atrás dos modais
} as const;

const gradient = (direction: string, from: string, to: string) => `linear-gradient(${direction}, ${from}, ${to})`;

// placeholders das fotos do casal no hero, até as fotos reais serem colocadas em src/assets/images/hero.
// O 1º é o gradiente do design (horizontal no desktop, vertical no mobile); os demais são variações do mesmo tom,
// para a troca automática de slides ser visível mesmo sem fotos.
export const heroPlaceholders = [
  { xs: gradient('to bottom', '#93a3c0', '#3c4f78'), md: gradient('to right', '#93a3c0', '#3c4f78') },
  { xs: gradient('to top', '#8a9ec2', '#34476f'), md: gradient('to left', '#8a9ec2', '#34476f') },
  { xs: gradient('to bottom right', '#9fadc9', '#3f5280'), md: gradient('to bottom right', '#9fadc9', '#3f5280') }
] as const;

// cor de fundo do hero enquanto as fotos carregam
export const heroBackdrop = '#3c4f78';

export default colors;
