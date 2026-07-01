import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import {MymolimentiHero} from '~/components/mymolimenti/MymolimentiHero';
import {ShopByCategories} from '~/components/mymolimenti/ShopByCategories';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import {buildMymolimentiHeroSlides} from '~/lib/mymolimenti-hero';
import {fetchCategoryCollections} from '~/lib/mymolimenti-categories';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const [{shop, hero}] = await Promise.all([
    context.storefront.query(HOMEPAGE_SEO_QUERY, {
      variables: {handle: 'freestyle'},
    }),
  ]);

  const heroSlides = buildMymolimentiHeroSlides();

  return {
    shop,
    primaryHero: hero,
    heroSlides,
    seo: seoPayload.home({url: request.url}),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const categoryCollections = fetchCategoryCollections(context.storefront).catch(
    (error) => {
      // eslint-disable-next-line no-console
      console.error('[ShopByCategories] Storefront query failed:', error);
      return [] as Awaited<ReturnType<typeof fetchCategoryCollections>>;
    },
  );

  return {categoryCollections};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {heroSlides, categoryCollections} = useLoaderData<typeof loader>();

  return (
    <>
      <MymolimentiHero slides={heroSlides} />

      <Suspense fallback={<CategoriesSkeleton />}>
        <Await resolve={categoryCollections}>
          {(collections) => (
            <ShopByCategories categories={collections} />
          )}
        </Await>
      </Suspense>
    </>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="bg-white px-4 py-12 lg:px-[60px] lg:py-16">
      <div className="mb-10 h-10 w-64 animate-pulse rounded bg-black/5" />
      <div className="grid gap-6 lg:grid-cols-4">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i}>
            <div className="aspect-[312/360] animate-pulse bg-black/5" />
            <div className="mt-4 h-6 w-32 animate-pulse rounded bg-black/5" />
          </div>
        ))}
      </div>
    </section>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
  ${MEDIA_FRAGMENT}
` as const;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;
