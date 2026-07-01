export const ANNOUNCEMENTS = [
  'Free delivery on orders above $300',
  'New arrivals — shop the latest collection',
  'Join 10,000+ people living a healthy lifestyle',
];

export const NAV_LINKS = [
  {label: 'All Products', to: '/collections/all'},
  {label: 'Heating Tools', to: '/collections/all'},
  {label: 'Brushes & Combs', to: '/collections/all'},
  {label: 'Accessories', to: '/collections/all'},
] as const;

export const HERO_RATING =
  '4.9/5.00 (10,000+ people living healthy lifestyle)';

export const HERO_CTA = {
  label: 'Shop Collection',
  to: '/collections/all',
} as const;

export const HERO_SLIDES_CONTENT = [
  {
    title: 'Beautiful Hair Starts With The Right Tools',
    description:
      'Discover premium heating tools, brushes, and combs designed for salon-quality results at home.',
    image: {
      url: '/mymolimenti/hero/hero-1.jpg',
      altText: 'Molimenti hero slide 1',
      width: 1440,
      height: 1276,
    },
  },
  {
    title: 'Style With Confidence Every Day',
    description:
      'From everyday routines to special occasions — find the perfect tools for every hair type.',
    image: {
      url: '/mymolimenti/hero/hero-2.jpg',
      altText: 'Molimenti hero slide 2',
      width: 1440,
      height: 1276,
    },
  },
  {
    title: 'Tools Trusted By Professionals',
    description:
      'Join thousands who have upgraded their hair care with Molimenti professional-grade collection.',
    image: {
      url: '/mymolimenti/hero/hero-3.jpg',
      altText: 'Molimenti hero slide 3',
      width: 1440,
      height: 1276,
    },
  },
] as const;

export type HeroImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MymolimentiHeroSlide = {
  title: string;
  description: string;
  image: HeroImage;
};
