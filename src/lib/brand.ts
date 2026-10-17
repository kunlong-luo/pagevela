// Public-facing product identity only. Do not use for versioned storage, share AAD or URL migrations.
export const PRODUCT_NAME = 'Pagevela' as const;
export const PRODUCT_NAME_ZH = '页帆' as const;

/** UI display only: never use localized names for URLs or persisted identifiers. */
export function getProductDisplayName(language: 'zh' | 'en'): string {
  return language === 'zh' ? PRODUCT_NAME_ZH : PRODUCT_NAME;
}
