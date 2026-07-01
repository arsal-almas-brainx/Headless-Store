import {useState} from 'react';

import {IconArrow} from '~/components/Icon';
import {ANNOUNCEMENTS} from '~/components/mymolimenti/constants';

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const message = ANNOUNCEMENTS[index];

  const goToPrevious = () => {
    setIndex((current) =>
      current === 0 ? ANNOUNCEMENTS.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setIndex((current) =>
      current === ANNOUNCEMENTS.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="flex h-10 w-full items-center justify-center gap-10 bg-[#E0E0E0] px-4 md:gap-16 md:px-10 lg:px-[400px]">
      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous announcement"
        className="flex h-4 w-4 shrink-0 items-center justify-center opacity-40 transition hover:opacity-70"
      >
        <IconArrow direction="left" className="h-3.5 w-3.5" stroke="#000000" />
      </button>

      <p className="truncate text-center text-sm font-medium text-black">
        {message}
      </p>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next announcement"
        className="flex h-4 w-4 shrink-0 items-center justify-center transition hover:opacity-70"
      >
        <IconArrow direction="right" className="h-3.5 w-3.5" stroke="#000000" />
      </button>
    </div>
  );
}
