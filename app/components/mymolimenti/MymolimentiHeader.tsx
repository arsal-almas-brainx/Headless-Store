import {Await, useParams, useRouteLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {Suspense, useEffect, useMemo} from 'react';

import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Drawer, useDrawer} from '~/components/Drawer';
import {IconBag, IconCaret, IconMenu, IconSearch} from '~/components/Icon';
import {Link} from '~/components/Link';
import {AnnouncementBar} from '~/components/mymolimenti/AnnouncementBar';
import {NAV_LINKS} from '~/components/mymolimenti/constants';
import {MymolimentiLogo} from '~/components/mymolimenti/MymolimentiLogo';
import {MymolimentiMenuDrawer} from '~/components/mymolimenti/MymolimentiMenuDrawer';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import type {RootLoader} from '~/root';

export function MymolimentiHeader() {
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <MymolimentiMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />

      <header role="banner" className="sticky top-0 z-40 bg-white">
        <AnnouncementBar />

        <div className="hidden border-b border-black/5 lg:block">
          <div className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between px-16">
            <MymolimentiLogo asHeading />
            <DesktopNavigation />
            <HeaderActions variant="desktop" openCart={openCart} />
          </div>
        </div>

        <div className="border-b border-black/5 lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <button
              type="button"
              onClick={openMenu}
              aria-label="Open menu"
              className="flex h-8 w-8 items-center justify-center text-black"
            >
              <IconMenu className="h-5 w-5" stroke="#000000" />
            </button>

            <MymolimentiLogo asHeading className="text-[1.1rem] tracking-[0.28em]" />

            <HeaderActions variant="mobile" openCart={openCart} />
          </div>
        </div>
      </header>
    </>
  );
}

function DesktopNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-10 text-sm font-medium text-black"
    >
      {NAV_LINKS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          prefetch="intent"
          className="group flex items-center gap-1.5 transition hover:text-[#002927]"
        >
          <span>{item.label}</span>
          <IconCaret
            direction="down"
            className="h-3 w-3 text-[#444444] transition group-hover:text-[#002927]"
            stroke="currentColor"
          />
        </Link>
      ))}
    </nav>
  );
}

function HeaderActions({
  variant,
  openCart,
}: {
  variant: 'desktop' | 'mobile';
  openCart: () => void;
}) {
  const params = useParams();
  const searchPath = params.locale ? `/${params.locale}/search` : '/search';
  const iconSize = variant === 'desktop' ? 'h-[25px] w-[25px]' : 'h-5 w-5';
  const gap = variant === 'desktop' ? 'gap-6' : 'gap-3';

  return (
    <div className={`flex items-center ${gap}`}>
      <Link
        to={searchPath}
        prefetch="intent"
        aria-label="Search"
        className={`flex items-center justify-center text-black transition hover:text-[#002927] ${iconSize}`}
      >
        <IconSearch className={iconSize} />
      </Link>

      <CartButton openCart={openCart} iconSize={iconSize} />
    </div>
  );
}

function CartButton({
  openCart,
  iconSize,
}: {
  openCart: () => void;
  iconSize: string;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense
      fallback={
        <CartBadgeButton count={0} openCart={openCart} iconSize={iconSize} />
      }
    >
      <Await resolve={rootData.cart}>
        {(cart) => (
          <CartBadgeButton
            count={cart?.totalQuantity || 0}
            openCart={openCart}
            iconSize={iconSize}
          />
        )}
      </Await>
    </Suspense>
  );
}

function CartBadgeButton({
  count,
  openCart,
  iconSize,
}: {
  count: number;
  openCart: () => void;
  iconSize: string;
}) {
  const isHydrated = useIsHydrated();

  const content = useMemo(
    () => (
      <>
        <IconBag className={iconSize} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#444444] px-1 text-[10px] font-medium leading-none text-white">
            {count}
          </span>
        )}
      </>
    ),
    [count, iconSize],
  );

  const className = `relative flex items-center justify-center text-black transition hover:text-[#002927] ${iconSize}`;

  return isHydrated ? (
    <button type="button" onClick={openCart} aria-label="Open cart" className={className}>
      {content}
    </button>
  ) : (
    <Link to="/cart" aria-label="Cart" className={className}>
      {content}
    </Link>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}
