import {
  TAGLINE_ITEMS,
  TAGLINE_SEPARATOR,
} from '~/components/mymolimenti/marquee-config';

type TaglineMarqueeProps = {
  /** Animation duration in seconds for one full loop */
  duration?: number;
};

export function TaglineMarquee({duration = 35}: TaglineMarqueeProps) {
  const track = buildMarqueeTrack();

  return (
    <section
      className="overflow-hidden bg-[#f2f2f2] py-6"
      aria-label="Brand highlights"
    >
      <div className="mymolimenti-marquee relative flex">
        <div
          className="mymolimenti-marquee-track flex shrink-0 items-center"
          style={{animationDuration: `${duration}s`}}
        >
          {track}
        </div>
        <div
          className="mymolimenti-marquee-track flex shrink-0 items-center"
          style={{animationDuration: `${duration}s`}}
          aria-hidden="true"
        >
          {track}
        </div>
      </div>
    </section>
  );
}

function buildMarqueeTrack() {
  return TAGLINE_ITEMS.map((item, index) => (
    <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-[22px]">
      <span className="whitespace-nowrap text-lg text-black">{item}</span>
      <span className="whitespace-nowrap text-2xl leading-none text-black">
        {TAGLINE_SEPARATOR}
      </span>
    </span>
  ));
}
