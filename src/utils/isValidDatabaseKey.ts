// chaves que o app usa no Realtime Database (push ids e UIDs do Auth): letras, números, "-" e "_".
// Barras e pontos ficam de fora para que um valor vindo da URL nunca altere o caminho da chamada.
const DATABASE_KEY = /^[\w-]{1,128}$/;

export const isValidDatabaseKey = (key: string | undefined): key is string => key !== undefined && DATABASE_KEY.test(key);
