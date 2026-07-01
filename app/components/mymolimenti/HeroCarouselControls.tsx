import {IconArrow} from '~/components/Icon';

type HeroCarouselControlsProps = {
  total: number;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export function HeroCarouselControls({
  total,
  activeIndex,
  onPrevious,
  onNext,
  onSelect,
}: HeroCarouselControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous slide"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white/90 text-black transition hover:bg-white"
      >
        <IconArrow direction="left" className="h-3.5 w-3.5" stroke="currentColor" />
      </button>

      <div className="flex items-center gap-6">
        {Array.from({length: total}).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className={`h-px w-[50px] transition ${
              index === activeIndex ? 'bg-black' : 'bg-black/25 hover:bg-black/40'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white/90 text-black transition hover:bg-white"
      >
        <IconArrow direction="right" className="h-3.5 w-3.5" stroke="currentColor" />
      </button>
    </div>
  );
}
