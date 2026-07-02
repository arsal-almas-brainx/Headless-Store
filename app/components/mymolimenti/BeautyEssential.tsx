import {Link} from '~/components/Link';

export function BeautyEssential() {
  return (
    <section className="relative bg-[#f5f5f5]">
      <div className="relative">
        {/* Responsive background image */}
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/mymolimenti/beauty-essential/desktop.png"
          />
          <img
            src="/mymolimenti/beauty-essential/mobile.png"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </picture>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-4 sm:px-6 lg:px-[60px]">
            <div className="max-w-xl">
              <h2 className="mb-4 font-serif text-[1.75rem] leading-tight text-white sm:text-[2rem] lg:text-[2.5rem]">
                More Than a Brush - It's a Beauty Essential.
              </h2>
              <p className="mb-6 text-base leading-relaxed text-white/90 sm:text-lg">
                Crafted with care, built to last. Our brushes are designed to detangle, smooth, and protect — all while respecting your hair and the planet.
              </p>
              <Link
                to="/products"
                prefetch="intent"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-medium text-[#002927] transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
