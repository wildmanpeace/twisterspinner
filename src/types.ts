/** A space on the mat that the spinner can land on. */
export interface Space {
  id: string;
  label: string;
  /** Fill color of the wheel slice. */
  color: string;
  /** Emoji (or short text) drawn on the slice. */
  icon?: string;
  /** Outline for the slice, e.g. to keep a black slice visible on a dark background. */
  stroke?: string;
}

/** Visual styling for the page and wheel. */
export interface Look {
  background: string;
  foreground: string;
  accent: string;
  /** Rim drawn around the whole wheel. */
  wheelBorder: string;
  /** Fill for the inner ring that shows the limb names. Alternates between the two. */
  limbRing: [string, string];
  limbText: string;
  fontFamily?: string;
}

export interface Theme {
  id: string;
  name: string;
  spaces: Space[];
  look: Look;
}

export interface Limb {
  id: string;
  label: string;
  icon?: string;
}

/** A set of limbs; this is how difficulty is adjusted (e.g. kids use just Hand/Foot). */
export interface LimbSet {
  id: string;
  name: string;
  limbs: Limb[];
}
