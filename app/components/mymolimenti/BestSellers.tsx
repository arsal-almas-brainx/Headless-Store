import {useRef, useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import type {Product, Collection} from '@shopify/hydrogen/storefront-api-types';

import {
  ProductCard,
  ArrowLeftIcon,
  ArrowRightIcon,
  MOCK_PRODUCTS,
} from '~/components/mymolimenti/ProductSlider';

const PLACEHOLDER_IMAGE =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-6_large.png';

type BestSellersProps = {
  products: Product[];
  collectionImage?: Collection['image'] | null;
  title?: string;
};

export function BestSellers({
  products,
  collectionImage,
  title = 'Best Sellers',
}: BestSellersProps) {
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const displayProducts =
    products && products.length > 0 ? products : MOCK_PRODUCTS;

  // Fallback: use first product's image as collection image
  const activeCollectionImage =
    collectionImage || displayProducts[0]?.variants?.nodes?.[0]?.image;

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    const el = ref.current;
    const totalScrollable = el.scrollWidth - el.clientWidth;
    if (totalScrollable > 0) {
      setScrollPercentage((el.scrollLeft / totalScrollable) * 100);
    }
  };

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    const container = ref.current;
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
    handleScroll(desktopSliderRef);
    handleScroll(mobileSliderRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayProducts.length]);

  if (!displayProducts.length) return null;

  return (
    <section className="bg-white py-12 sm:14 lg:py-16">
      <div className="px-4 sm:px-6 lg:px-[60px]">
        {/* Mobile: Collection image on top */}
        <div className="mb-8 lg:hidden">
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#2b2725] to-[#120f0e]">
            {activeCollectionImage && (
              <div className="pointer-events-none absolute inset-0 scale-110 opacity-40 blur-xl">
                <img
                  src={activeCollectionImage.url}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
            )}
            <div className="relative z-10 w-[78%] max-w-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {activeCollectionImage ? (
                <Image
                  data={activeCollectionImage}
                  alt={activeCollectionImage.altText || 'Best Sellers collection'}
                  className="h-full w-full object-cover"
                  sizes="78vw"
                />
              ) : (
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt="Best Sellers"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Two-column layout */}
        <div className="hidden lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12 lg:items-start">
          {/* Left: Collection image card */}
          <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#2b2725] to-[#120f0e]">
            {activeCollectionImage && (
              <div className="pointer-events-none absolute inset-0 scale-110 opacity-40 blur-xl">
                <img
                  src={activeCollectionImage.url}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
            )}
            <div className="relative z-10 w-[78%] max-w-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {activeCollectionImage ? (
                <Image
                  data={activeCollectionImage}
                  alt={activeCollectionImage.altText || 'Best Sellers collection'}
                  className="h-full w-full object-cover"
                  sizes="340px"
                />
              ) : (
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt="Best Sellers"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Right: Title + Slider + Progress + Arrows */}
          <div className="flex flex-col min-w-0">
            <h2 className="mb-6 font-serif text-[2.5rem] leading-tight text-[#002927]">
              {title}
            </h2>

            <div
              ref={desktopSliderRef}
              onScroll={() => handleScroll(desktopSliderRef)}
              className="hiddenScroll flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            >
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="relative mr-6 h-0.5 flex-1 overflow-hidden rounded-full bg-black/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#002927] transition-transform duration-100"
                  style={{
                    width: '30%',
                    transform: `translateX(${scrollPercentage * 2.33}%)`,
                  }}
                />
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => scroll('left', desktopSliderRef)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#002927]/20 bg-white text-[#002927] transition hover:bg-[#002927] hover:text-white focus:outline-none"
                  aria-label="Scroll left"
                >
                  <ArrowLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right', desktopSliderRef)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002927] text-white transition hover:bg-[#001f1d] focus:outline-none"
                  aria-label="Scroll right"
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Title + Slider below image */}
        <div className="lg:hidden">
          <h2 className="mb-6 font-serif text-[1.75rem] leading-tight text-[#002927]">
            {title}
          </h2>

          <div
            ref={mobileSliderRef}
            onScroll={() => handleScroll(mobileSliderRef)}
            className="hiddenScroll flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pb-2 sm:px-6"
          >
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="relative mr-6 h-0.5 flex-1 overflow-hidden rounded-full bg-black/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#002927] transition-transform duration-100"
                style={{
                  width: '30%',
                  transform: `translateX(${scrollPercentage * 2.33}%)`,
                }}
              />
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => scroll('left', mobileSliderRef)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#002927]/20 bg-white text-[#002927] transition hover:bg-[#002927] hover:text-white focus:outline-none"
                aria-label="Scroll left"
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => scroll('right', mobileSliderRef)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002927] text-white transition hover:bg-[#001f1d] focus:outline-none"
                aria-label="Scroll right"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
