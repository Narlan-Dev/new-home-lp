export interface HeroSlide {
  image?: string;
}

const photos = import.meta.glob<string>('/src/assets/images/hero/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const images = Object.entries(photos)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

export const HERO_SLIDES: HeroSlide[] = images.length ? images.map((image) => ({ image })) : [{}, {}, {}];

export const HERO_AUTOPLAY_MS = 8000;
