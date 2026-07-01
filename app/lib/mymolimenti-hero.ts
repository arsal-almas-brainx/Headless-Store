import {
  HERO_SLIDES_CONTENT,
  type MymolimentiHeroSlide,
} from '~/components/mymolimenti/constants';

export function buildMymolimentiHeroSlides(): MymolimentiHeroSlide[] {
  return HERO_SLIDES_CONTENT.map((slide) => ({...slide}));
}
