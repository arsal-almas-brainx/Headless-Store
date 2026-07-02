import type {Storefront} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query collectionProducts(
    $handle: String!
    $first: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          id
          title
          publishedAt
          handle
          tags
          variants(first: 1) {
            nodes {
              id
              availableForSale
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
` as const;

type StorefrontClient = Pick<Storefront, 'query'>;

export async function fetchSliderCollectionProducts(
  storefront: StorefrontClient,
  handle: string,
  first: number = 12,
): Promise<Product[]> {
  try {
    const data = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
      variables: {
        handle,
        first,
      },
    });

    if (!data?.collection?.products?.nodes) {
      return [];
    }

    return data.collection.products.nodes as Product[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[fetchSliderCollectionProducts] Query failed for handle: ${handle}`, error);
    return [];
  }
}
