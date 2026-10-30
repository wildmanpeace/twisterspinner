import type { Limb, LimbSet, Space, Theme } from './types';

export interface SpinResult {
  limb: Limb;
  space: Space;
  /** Index of the slice on the wheel (limb-major: all of limb 0's spaces, then limb 1's, ...). */
  slice: number;
}

export type Rng = () => number;

/** Throws if a theme or limb set can't be drawn as a wheel. */
export function validate(theme: Theme, limbSet: LimbSet): void {
  const check = (what: string, items: { id: string }[]) => {
    if (items.length === 0) throw new Error(`${what} needs at least one entry`);
    const ids = new Set(items.map((i) => i.id));
    if (ids.size !== items.length) throw new Error(`${what} has duplicate ids`);
  };
  check(`Theme "${theme.id}" spaces`, theme.spaces);
  check(`Limb set "${limbSet.id}" limbs`, limbSet.limbs);
}

export function sliceCount(theme: Theme, limbSet: LimbSet): number {
  return theme.spaces.length * limbSet.limbs.length;
}

export function spin(theme: Theme, limbSet: LimbSet, rng: Rng = Math.random): SpinResult {
  const slice = Math.floor(rng() * sliceCount(theme, limbSet));
  const spaces = theme.spaces.length;
  return {
    limb: limbSet.limbs[Math.floor(slice / spaces)],
    space: theme.spaces[slice % spaces],
    slice,
  };
}

/**
 * Rotation (degrees, clockwise) that brings `slice` under the pointer at the top,
 * continuing forward from `current` with at least `turns` full turns.
 * `jitter` in [-0.5, 0.5] offsets the landing point within the slice.
 */
export function targetRotation(
  current: number,
  slice: number,
  slices: number,
  turns: number,
  jitter = 0,
): number {
  const size = 360 / slices;
  const center = (slice + 0.5 + jitter * 0.8) * size;
  const target = (((-center % 360) + 360) % 360);
  const now = ((current % 360) + 360) % 360;
  const delta = (target - now + 360) % 360;
  return current + turns * 360 + delta;
}
