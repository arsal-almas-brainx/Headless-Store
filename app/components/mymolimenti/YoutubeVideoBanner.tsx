import {useState} from 'react';

import {
  YOUTUBE_POSTER_ALT,
  YOUTUBE_POSTER_IMAGE,
  YOUTUBE_VIDEO_URL,
} from '~/components/mymolimenti/youtube-config';
import {
  getYoutubeEmbedUrl,
  getYoutubeThumbnailUrl,
  getYoutubeVideoId,
} from '~/lib/youtube';

export function YoutubeVideoBanner() {
  const videoId = getYoutubeVideoId(YOUTUBE_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState(false);

  const posterSrc =
    YOUTUBE_POSTER_IMAGE ||
    (videoId ? getYoutubeThumbnailUrl(videoId) : null);

  if (!videoId) {
    if (!posterSrc) return null;

    return (
      <section className="relative w-full overflow-hidden bg-black" aria-label="Brand video">
        <PosterImage src={posterSrc} alt={YOUTUBE_POSTER_ALT} />
      </section>
    );
  }

  if (isPlaying) {
    return (
      <section className="relative w-full overflow-hidden bg-black" aria-label="Brand video">
        <div className="relative aspect-[1440/660] w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={getYoutubeEmbedUrl(videoId)}
            title={YOUTUBE_POSTER_ALT}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black" aria-label="Brand video">
      <button
        type="button"
        className="group relative block w-full text-left"
        onClick={() => setIsPlaying(true)}
        aria-label="Play brand video"
      >
        {posterSrc ? (
          <PosterImage src={posterSrc} alt={YOUTUBE_POSTER_ALT} />
        ) : (
          <div className="aspect-[1440/660] w-full bg-black" />
        )}

        <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />

        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-105 lg:h-20 lg:w-20">
          <PlayIcon />
        </span>
      </button>
    </section>
  );
}

function PosterImage({src, alt}: {src: string; alt: string}) {
  return (
    <div className="relative aspect-[1440/660] w-full">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="ml-1 h-7 w-7 fill-black lg:h-8 lg:w-8"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
