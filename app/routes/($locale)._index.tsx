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
import {TaglineMarquee} from '~/components/mymolimenti/TaglineMarquee';
import {YoutubeVideoBanner} from '~/components/mymolimenti/YoutubeVideoBanner';
import {ProductSlider} from '~/components/mymolimenti/ProductSlider';
import {BestSellers} from '~/components/mymolimenti/BestSellers';
import {HealthAndSafety} from '~/components/mymolimenti/HealthAndSafety';
import {BeautyEssential} from '~/components/mymolimenti/BeautyEssential';
import {
  PRODUCT_SLIDER_COLLECTION_HANDLE,
  BEST_SELLERS_COLLECTION_HANDLE,
} from '~/components/mymolimenti/product-slider-config';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import {buildMymolimentiHeroSlides} from '~/lib/mymolimenti-hero';
import {fetchCategoryCollections} from '~/lib/mymolimenti-categories';
import {fetchSliderCollectionProducts} from '~/lib/mymolimenti-products';
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

  const sliderCollection = fetchSliderCollectionProducts(
    context.storefront,
    PRODUCT_SLIDER_COLLECTION_HANDLE,
  ).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[ProductSlider] Storefront query failed:', error);
    return null as Awaited<ReturnType<typeof fetchSliderCollectionProducts>>;
  });

  const bestSellersCollection = fetchSliderCollectionProducts(
    context.storefront,
    BEST_SELLERS_COLLECTION_HANDLE,
  ).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[BestSellers] Storefront query failed:', error);
    return null as Awaited<ReturnType<typeof fetchSliderCollectionProducts>>;
  });

  return {categoryCollections, sliderCollection, bestSellersCollection};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {heroSlides, categoryCollections, sliderCollection, bestSellersCollection} = useLoaderData<typeof loader>();

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

      <TaglineMarquee />

      <YoutubeVideoBanner />

      <Suspense fallback={<SliderSkeleton />}>
        <Await resolve={sliderCollection}>
          {(result) => (
            <ProductSlider
              products={result?.products ?? []}
            />
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<SliderSkeleton />}>
        <Await resolve={bestSellersCollection}>
          {(result) => (
            <BestSellers
              products={result?.products ?? []}
              collectionImage={result?.image}
            />
          )}
        </Await>
      </Suspense>

      <TaglineMarquee />

      <HealthAndSafety />

      <BeautyEssential />
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

function SliderSkeleton() {
  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="px-4 sm:px-6 lg:px-[60px]">
        <div className="mb-8 h-10 w-48 animate-pulse rounded bg-black/5 lg:mb-10" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({length: 3}).map((_, i) => (
            <div key={i} className="w-[72vw] shrink-0 sm:w-[40vw] md:w-[32vw] lg:w-[calc(25%-18px)]">
              <div className="aspect-[1.05] animate-pulse rounded-2xl bg-black/5" />
              <div className="mt-3 h-4 w-24 animate-pulse rounded bg-black/5" />
              <div className="mt-1.5 h-5 w-40 animate-pulse rounded bg-black/5" />
              <div className="mt-1 h-4 w-16 animate-pulse rounded bg-black/5" />
              <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-black/5" />
            </div>
          ))}
        </div>
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
