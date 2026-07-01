import {Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

import {Link} from '~/components/Link';
import {
  HERO_CTA,
  HERO_RATING,
  type MymolimentiHeroSlide,
} from '~/components/mymolimenti/constants';
import {HeroCarouselControls} from '~/components/mymolimenti/HeroCarouselControls';
import {StarRating} from '~/components/mymolimenti/StarRating';

type MymolimentiHeroProps = {
  slides: MymolimentiHeroSlide[];
};

export function MymolimentiHero({slides}: MymolimentiHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  if (!slideCount) return null;

  const activeSlide = slides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? slideCount - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === slideCount - 1 ? 0 : current + 1));
  };

  return (
    <section className="relative w-full bg-white" aria-label="Hero">
      <div className="relative h-[681px] lg:h-[638px]">
        {slides.map((slide, index) => (
          <div
            key={`${slide.title}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            {/* Desktop: empty left half, image on right */}
            <div className="hidden h-full bg-white lg:grid lg:grid-cols-2">
              <div className="bg-white" />
              <HeroImagePanel
                image={slide.image}
                alt={slide.image.altText || slide.title}
                sizes="50vw"
                className="h-full w-full"
              />
            </div>

            {/* Mobile: full-width image */}
            <div className="relative h-full lg:hidden">
              <HeroImagePanel
                image={slide.image}
                alt={slide.image.altText || slide.title}
                sizes="100vw"
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent" />
            </div>
          </div>
        ))}

        {/* Copy + CTA — left column on desktop, overlay on mobile */}
        <div className="absolute inset-0 z-10 flex">
          <div className="flex h-full w-full flex-col justify-center px-4 pb-24 pt-8 sm:px-6 lg:w-1/2 lg:px-[60px] lg:pb-28">
            <div className="max-w-[539px]">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-[#002927]">
                <StarRating />
                <p className="text-xs font-medium text-[#002927] sm:text-sm">
                  {HERO_RATING}
                </p>
              </div>

              <h2 className="mb-4 font-serif text-[2rem] leading-[1.05] text-[#002927] sm:text-[2.5rem] lg:text-[3.25rem]">
                {activeSlide.title}
              </h2>

              <p className="mb-8 max-w-[517px] text-sm leading-7 text-[#002927]/80 sm:text-base">
                {activeSlide.description}
              </p>

              <Link
                to={HERO_CTA.to}
                prefetch="intent"
                className="inline-flex h-[52px] min-w-[180px] items-center justify-center bg-[#002927] px-6 text-sm font-medium text-white transition hover:bg-[#001f1d]"
              >
                {HERO_CTA.label}
              </Link>
            </div>
          </div>
        </div>

        {slideCount > 1 && (
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 lg:left-[540px] lg:translate-x-0">
            <HeroCarouselControls
              total={slideCount}
              activeIndex={activeIndex}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onSelect={setActiveIndex}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function HeroImagePanel({
  image,
  alt,
  sizes,
  className,
}: {
  image: MymolimentiHeroSlide['image'];
  alt: string;
  sizes: string;
  className?: string;
}) {
  const isLocalAsset = image.url.startsWith('/');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLocalAsset ? (
        <img
          src={image.url}
          alt={alt}
          sizes={sizes}
          className="h-full w-full object-cover"
          loading="eager"
          width={image.width ?? undefined}
          height={image.height ?? undefined}
        />
      ) : (
        <Image
          data={image}
          alt={alt}
          sizes={sizes}
          className="h-full w-full object-cover"
          loading="eager"
        />
      )}
    </div>
  );
}
