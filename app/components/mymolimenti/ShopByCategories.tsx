import {CATEGORY_SECTION_TITLE} from '~/components/mymolimenti/category-config';

import {Image} from '@shopify/hydrogen';

import {Link} from '~/components/Link';

export type CategoryItem = {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

type ShopByCategoriesProps = {
  categories: CategoryItem[];
  title?: string;
};

const PLACEHOLDER =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-6_large.png';

export function ShopByCategories({
  categories,
  title = CATEGORY_SECTION_TITLE,
}: ShopByCategoriesProps) {
  const items = categories.filter(Boolean).slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-[60px] lg:py-16">
      <h2 className="mb-8 font-serif text-[1.75rem] leading-tight text-[#002927] lg:mb-10 lg:text-[2.5rem]">
        {title}
      </h2>

      {/* Desktop: 4-column grid */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-4">
        {items.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory lg:hidden">
        {items.map((category) => (
          <div key={category.id} className="w-[72vw] max-w-[312px] shrink-0 snap-start">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({category}: {category: CategoryItem}) {
  const image = category.image?.url
    ? category.image
    : {
        url: PLACEHOLDER,
        altText: category.title,
        width: 312,
        height: 360,
      };

  const isLocal = image.url.startsWith('/');

  return (
    <Link
      to={`/collections/${category.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div className="relative aspect-[312/360] overflow-hidden bg-[#f5f5f5]">
        {isLocal ? (
          <img
            src={image.url}
            alt={image.altText || category.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Image
            data={image}
            alt={image.altText || category.title}
            sizes="(min-width: 64em) 25vw, 72vw"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>
      <p className="mt-[18px] text-lg font-medium text-[#002927] lg:text-xl">
        {category.title}
      </p>
    </Link>
  );
}
