// quantos presentes aparecem antes de "Ver mais presentes"
export const GIFTS_PREVIEW_COUNT = 8;

// limites aceitos pelas regras do banco (database.rules.json); mantenha os dois lados iguais
export const GIFT_LIMITS = { nameMax: 120, priceMax: 1_000_000, urlMax: 2048 } as const;
