/**
 * Collection handles to show in "Shop by Categories".
 *
 * How to find a handle in Shopify Admin:
 * Products → Collections → open a collection → check the URL:
 *   .../collections/{handle}
 *
 * Each collection must be published to the Headless sales channel.
 */
export const CATEGORY_COLLECTION_HANDLES = [
  'kits-sets',
  'brushes-and-comb',
  'heating-tools',
  'accessories',
  // Add your handles below (max 4 shown on homepage):
  // 'heating-tools',
  // 'brushes-combs',
  // 'accessories',
] as const;

export const CATEGORY_SECTION_TITLE = 'Shop by Categories';
