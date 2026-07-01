import {Link} from '~/components/Link';

type MymolimentiLogoProps = {
  className?: string;
  asHeading?: boolean;
};

export function MymolimentiLogo({
  className = '',
  asHeading = false,
}: MymolimentiLogoProps) {
  const logo = (
    <span
      className={`font-serif text-[1.35rem] font-normal uppercase tracking-[0.35em] text-black md:text-[1.5rem] ${className}`}
    >
      Molimenti
    </span>
  );

  return (
    <Link to="/" prefetch="intent" className="inline-flex items-center">
      {asHeading ? <h1 className="m-0">{logo}</h1> : logo}
    </Link>
  );
}
