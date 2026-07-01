const STAR_PATH =
  'M10 1.5L12.09 6.26L17.18 6.99L13.59 10.74L14.18 15.86L10 13.77L5.82 15.86L6.41 10.74L2.82 6.99L7.91 6.26L10 1.5Z';

type StarRatingProps = {
  className?: string;
};

export function StarRating({className = ''}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({length: 5}).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 fill-[#002927]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}
