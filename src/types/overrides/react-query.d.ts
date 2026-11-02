import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** mensagem do toast quando a mutação falha */
      errorMessage?: string;
      /** a tela mostra o erro por conta própria (ex.: formulário de login) */
      suppressErrorToast?: boolean;
    };
  }
}
