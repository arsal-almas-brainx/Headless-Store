import type {Storefront} from '@shopify/hydrogen';

import {CATEGORY_COLLECTION_HANDLES} from '~/components/mymolimenti/category-config';
import type {CategoryItem} from '~/components/mymolimenti/ShopByCategories';

const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query categoryCollectionByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      image {
        altText
        width
        height
        url
      }
    }
  }
` as const;

type StorefrontClient = Pick<Storefront, 'query'>;

export async function fetchCategoryCollections(
  storefront: StorefrontClient,
): Promise<CategoryItem[]> {
  const results = await Promise.all(
    CATEGORY_COLLECTION_HANDLES.map((handle) =>
      storefront.query(COLLECTION_BY_HANDLE_QUERY, {variables: {handle}}),
    ),
  );

  const collections = results
    .map((result) => result?.collection)
    .filter((collection): collection is CategoryItem => Boolean(collection?.id));

  if (collections.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ShopByCategories] No collections found. Check CATEGORY_COLLECTION_HANDLES in category-config.ts and ensure each collection is published to Headless.',
      {handles: CATEGORY_COLLECTION_HANDLES},
    );
  }

  return collections;
}
