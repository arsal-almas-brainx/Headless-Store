import {useRef, useState, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components/Link';
import {StarRating} from '~/components/mymolimenti/StarRating';
import {AddToCartButton} from '~/components/AddToCartButton';
import {PRODUCT_SLIDER_SECTION_TITLE} from '~/components/mymolimenti/product-slider-config';

type ProductSliderProps = {
  products: Product[];
  title?: string;
};

const PLACEHOLDER_IMAGE =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-6_large.png';

export function ProductSlider({
  products,
  title = PRODUCT_SLIDER_SECTION_TITLE,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const displayProducts =
    products && products.length > 0 ? products : MOCK_PRODUCTS;

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const totalScrollable = el.scrollWidth - el.clientWidth;
    if (totalScrollable > 0) {
      setScrollPercentage((el.scrollLeft / totalScrollable) * 100);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const card = container.querySelector('[data-card]') as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 24 : container.clientWidth * 0.5;
    container.scrollTo({
      left:
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayProducts.length]);

  if (!displayProducts.length) return null;

  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      {/* Section heading */}
      <h2 className="mb-8 px-4 font-serif text-[1.75rem] leading-tight text-[#002927] sm:px-6 lg:mb-10 lg:px-[60px] lg:text-[2.5rem]">
        {title}
      </h2>

      {/* Slider track — hiddenScroll removes native scrollbar; progress bar below acts as indicator */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="hiddenScroll flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pb-2 sm:px-6 lg:px-[60px]"
      >
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Progress bar + Navigation arrows */}
      <div className="mt-6 flex items-center justify-between px-4 sm:px-6 lg:px-[60px]">
        {/* Scroll progress track */}
        <div className="relative mr-6 h-0.5 flex-1 overflow-hidden rounded-full bg-black/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#002927] transition-transform duration-100"
            style={{
              width: '30%',
              transform: `translateX(${scrollPercentage * 2.33}%)`,
            }}
          />
        </div>

        {/* Arrow buttons */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#002927]/20 bg-white text-[#002927] transition hover:bg-[#002927] hover:text-white focus:outline-none"
            aria-label="Scroll left"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002927] text-white transition hover:bg-[#001f1d] focus:outline-none"
            aria-label="Scroll right"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Product card ───────────────────────────────────────────────── */

export function ProductCard({product}: {product: Product}) {
  const firstVariant = product.variants?.nodes?.[0];
  const image = firstVariant?.image ?? null;
  const price = firstVariant?.price;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const tags: string[] = product.tags ?? [];

  const hasDiscount =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div
      data-card
      className="w-[72vw] shrink-0 snap-start sm:w-[40vw] md:w-[32vw] lg:w-[312px]"
    >
      {/* Image */}
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="group block"
      >
        <div className="relative aspect-[1.05] overflow-hidden rounded-2xl bg-[#f5f5f5]">
          {/* Tag badges — horizontal row, overlaid top-left */}
          {tags.length > 0 && (
            <div className="absolute left-3 top-3 z-10 flex flex-row gap-1.5">
              <span className="rounded-full bg-[#E8630A] px-3 py-1 text-[11px] font-semibold leading-none text-white">
                {tags[0]}
              </span>
              {tags.length >= 2 && (
                <span className="rounded-full bg-[#1a1a1a] px-3 py-1 text-[11px] font-semibold leading-none text-white">
                  {tags[1]}
                </span>
              )}
            </div>
          )}

          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              sizes="(min-width: 64em) 312px, (min-width: 48em) 32vw, 72vw"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={PLACEHOLDER_IMAGE}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>

        {/* Stars + reviews */}
        <div className="mt-3 flex items-center gap-1.5">
          <StarRating />
          <span className="text-[12px] font-medium text-[#002927]/70">
            ( 92 Reviews )
          </span>
        </div>

        {/* Title */}
        <p className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#002927]">
          {product.title}
        </p>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          {price && (
            <span className="text-[15px] font-semibold text-[#002927]">
              <Money withoutTrailingZeros data={price} />
            </span>
          )}
          {hasDiscount && compareAtPrice && (
            <span className="text-[13px] text-[#002927]/50 line-through">
              <Money withoutTrailingZeros data={compareAtPrice} />
            </span>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="mt-4">
        {firstVariant?.availableForSale ? (
          <AddToCartButton
            lines={[{quantity: 1, merchandiseId: firstVariant.id}]}
            className="w-full rounded-full border border-[#002927] bg-transparent py-3 text-[13px] font-semibold text-[#002927] transition-colors duration-300 hover:bg-[#002927] hover:text-white focus:outline-none"
          >
            Add To Cart
          </AddToCartButton>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full border border-[#002927]/20 py-3 text-[13px] font-semibold text-[#002927]/40"
          >
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Arrow icons ────────────────────────────────────────────────── */

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
      <path d="M13 4L7 10L13 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
      <path d="M7 4L13 10L7 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Shared arrow icons export for reuse in BestSellers ─────────── */
export {ArrowLeftIcon, ArrowRightIcon};

/* ─── Fallback mock data ─────────────────────────────────────────── */

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Your Paddle Brush',
    handle: 'your-paddle-brush',
    tags: ['Best Selling', 'Featured'],
    variants: {nodes: [{id: 'gid://shopify/ProductVariant/1', availableForSale: true, image: {url: '/mymolimenti/hero/hero-1.jpg', altText: 'Your Paddle Brush', width: 600, height: 600}, price: {amount: '449.0', currencyCode: 'USD'}, compareAtPrice: {amount: '500.0', currencyCode: 'USD'}, selectedOptions: []}]},
  } as unknown as Product,
  {
    id: 'gid://shopify/Product/2',
    title: 'Your Round Brush 25 mm',
    handle: 'your-round-brush-25mm',
    tags: ['Best Selling', 'Featured'],
    variants: {nodes: [{id: 'gid://shopify/ProductVariant/2', availableForSale: true, image: {url: '/mymolimenti/hero/hero-2.jpg', altText: 'Your Round Brush 25 mm', width: 600, height: 600}, price: {amount: '249.0', currencyCode: 'USD'}, compareAtPrice: {amount: '300.0', currencyCode: 'USD'}, selectedOptions: []}]},
  } as unknown as Product,
  {
    id: 'gid://shopify/Product/3',
    title: 'Your Round Brush 34 mm',
    handle: 'your-round-brush-34mm',
    tags: ['Best Selling', 'Featured'],
    variants: {nodes: [{id: 'gid://shopify/ProductVariant/3', availableForSale: true, image: {url: '/mymolimenti/hero/hero-3.jpg', altText: 'Your Round Brush 34 mm', width: 600, height: 600}, price: {amount: '279.0', currencyCode: 'USD'}, compareAtPrice: {amount: '315.0', currencyCode: 'USD'}, selectedOptions: []}]},
  } as unknown as Product,
  {
    id: 'gid://shopify/Product/4',
    title: 'Your Round Brush 44 mm',
    handle: 'your-round-brush-44mm',
    tags: ['Best Selling', 'Featured'],
    variants: {nodes: [{id: 'gid://shopify/ProductVariant/4', availableForSale: true, image: {url: PLACEHOLDER_IMAGE, altText: 'Your Round Brush 44 mm', width: 600, height: 600}, price: {amount: '299.0', currencyCode: 'USD'}, compareAtPrice: {amount: '315.0', currencyCode: 'USD'}, selectedOptions: []}]},
  } as unknown as Product,
];
