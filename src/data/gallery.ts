export interface Plate {
  /** Stable id, matches the filenames in /public/gallery */
  id: string;
  full: string;
  thumb: string;
  /** Intrinsic pixel size of `full`, so the browser can reserve space */
  width: number;
  height: number;
  title: string;
  caption: string;
  /**
   * Literal Tailwind utilities for this tile's slot in the mosaic. Written out
   * in full rather than composed at runtime, because Tailwind only emits
   * classes it can find as complete strings in the source.
   */
  tileClass?: string;
}

const plate = (n: number, rest: Omit<Plate, 'id' | 'full' | 'thumb'>): Plate => {
  const tag = `plate-${String(n).padStart(2, '0')}`;
  return {
    id: tag,
    full: `/gallery/${tag}.jpg`,
    thumb: `/gallery/${tag}-thumb.jpg`,
    ...rest
  };
};

/**
 * The fourteen frames, in the order they are presented.
 *
 * Index 0 carries the hero; indices 1–11 fill the two mosaic movements; index
 * 12 anchors the intermission band at its native tall aspect; and the last
 * entry reprises the opening frame as the curtain call. The lightbox walks the
 * whole array regardless of where a plate is displayed.
 */
export const PLATES: Plate[] = [
  plate(1, {
    width: 2800,
    height: 2100,
    title: 'The Society, Assembled',
    caption: 'Fifteen kitchens, one table, and very nearly the whole team in a single frame.'
  }),
  plate(2, {
    width: 1500,
    height: 2000,
    title: 'The Bánh Mì Arrives',
    caption: 'A tray of baguettes carried in warm, moments before the line formed.',
    tileClass: 'lg:col-span-5 lg:aspect-[4/5]'
  }),
  plate(3, {
    width: 1500,
    height: 2000,
    title: 'A Generous First Plate',
    caption:
      'The correct way to begin: a little of everything on the table, and a firm plan for seconds.',
    tileClass: 'lg:col-span-4 lg:aspect-[3/4] lg:mt-10'
  }),
  plate(4, {
    width: 1500,
    height: 2000,
    title: 'Two Plates, No Regrets',
    caption: 'Butter chicken and passion fruit pie sharing a rim, exactly as the menu intended.',
    tileClass: 'lg:col-span-3 lg:aspect-[2/3] lg:mt-24'
  }),
  plate(5, {
    width: 1500,
    height: 2000,
    title: 'Service Begins',
    caption: "The line moves down the black linen; Porto's cheese rolls hold the near end.",
    tileClass: 'lg:col-span-4 lg:aspect-[3/4]'
  }),
  plate(6, {
    width: 1500,
    height: 2000,
    title: 'The Queue',
    caption: 'Twenty deep along the table, the atrium unusually quiet for a Wednesday.',
    tileClass: 'lg:col-span-3 lg:aspect-[2/3] lg:mt-14'
  }),
  plate(7, {
    width: 1500,
    height: 2000,
    title: 'Garlic Chili Naan, Claimed',
    caption: 'Naan, rendang and a bánh mì negotiating for space on a single plate.',
    tileClass: 'lg:col-span-5 lg:aspect-[4/5] lg:mt-6'
  }),
  plate(8, {
    width: 1500,
    height: 2000,
    title: 'Surveying the Spoils',
    caption: 'A plate assembled with real strategy: satay, naan, rice, guacamole, and a plan.',
    tileClass: 'lg:col-span-3 lg:aspect-[2/3]'
  }),
  plate(9, {
    width: 1500,
    height: 2000,
    title: 'Mid-Service',
    caption: 'The tables fill, the room turns loud, and the plates begin to disappear.',
    tileClass: 'lg:col-span-5 lg:aspect-[4/5] lg:mt-12'
  }),
  plate(10, {
    width: 1500,
    height: 2000,
    title: 'A Contribution Delivered',
    caption: 'Another dish set down on the table, still warm from the drive over.',
    tileClass: 'lg:col-span-4 lg:aspect-[3/4]'
  }),
  plate(11, {
    width: 1500,
    height: 2000,
    title: 'The Lemonade Poured',
    caption: 'Strawberry and blueberry, over ice, cup by cup by cup.',
    tileClass: 'lg:col-span-6 lg:aspect-[4/5]'
  }),
  plate(12, {
    width: 1500,
    height: 2000,
    title: 'The Guacamole',
    caption:
      'Bright with lime, generous to a fault, and the first bowl on the table to empty. The one everybody came back for.',
    tileClass: 'lg:col-span-6 lg:aspect-[4/5] lg:mt-16'
  }),
  plate(13, {
    width: 1125,
    height: 2000,
    title: 'The Full Spread',
    caption: 'Dessert, mains, and the drinks station: the entire table in three frames.'
  }),
  {
    // The opening frame, reprised as the closing one. Same file, distinct id so
    // the lightbox treats it as its own stop in the sequence.
    id: 'plate-01-reprise',
    full: '/gallery/plate-01.jpg',
    thumb: '/gallery/plate-01-thumb.jpg',
    width: 2800,
    height: 2100,
    title: 'Curtain Call',
    caption:
      'The frame we opened on, reprised: fifteen kitchens, one table, and nobody in any hurry to leave.'
  }
];

/** Plate I is the hero; it is not repeated in the mosaic. */
export const HERO_PLATE = PLATES[0];

/** First movement of the mosaic: plates II through VII. */
export const MOSAIC_ONE = PLATES.slice(1, 7);

/** Second movement: plates VIII through XII. */
export const MOSAIC_TWO = PLATES.slice(7, 12);

/** The tall triptych that anchors the intermission band. */
export const FEATURE_PLATE = PLATES[12];

/** The opening frame again, closing the sequence. */
export const CONCLUSION_PLATE = PLATES[13];

/**
 * Thirteen is skipped the way a building skips its thirteenth floor, so the
 * fourteen frames run I–XII and then XIV–XV.
 */
const NUMERALS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIV', 'XV'
];

export const FINAL_NUMERAL = NUMERALS[NUMERALS.length - 1];

export const numeralFor = (plateId: string): string => {
  const index = PLATES.findIndex((entry) => entry.id === plateId);
  return index >= 0 ? NUMERALS[index] : '';
};

export const GALLERY_META = {
  eventDate: 'August 12, 2026',
  plateCount: PLATES.length
};
