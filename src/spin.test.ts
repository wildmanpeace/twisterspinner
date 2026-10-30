import { describe, expect, it } from 'vitest';
import { limbSets } from './limbs';
import { sliceCount, spin, targetRotation, validate } from './spin';
import { themes } from './themes';

const [standard, kids] = limbSets;
const halloween = themes.find((t) => t.id === 'halloween')!;

describe('spin', () => {
  it('maps slices limb-major', () => {
    const n = sliceCount(halloween, standard);
    expect(n).toBe(16);
    const r = spin(halloween, standard, () => 5 / n);
    expect(r.limb.id).toBe('right-hand');
    expect(r.space.id).toBe('ghost');
  });

  it('only uses Hand/Foot for kids', () => {
    expect(sliceCount(halloween, kids)).toBe(8);
    const seen = new Set<string>();
    for (let i = 0; i < 8; i++) seen.add(spin(halloween, kids, () => i / 8).limb.label);
    expect([...seen].sort()).toEqual(['Foot', 'Hand']);
  });

  it('never goes out of range', () => {
    const r = spin(halloween, standard, () => 0.999999);
    expect(r.slice).toBe(15);
  });
});

describe('targetRotation', () => {
  it('lands the slice center at the top and always moves forward', () => {
    for (const current of [0, 100, 725, -30]) {
      for (let slice = 0; slice < 8; slice++) {
        const r = targetRotation(current, slice, 8, 5);
        expect(r).toBeGreaterThanOrEqual(current + 5 * 360);
        // Slice center (clockwise from top) plus rotation should be a multiple of 360.
        const landed = (((slice + 0.5) * 45 + r) % 360 + 360) % 360;
        expect(Math.min(landed, 360 - landed)).toBeCloseTo(0);
      }
    }
  });
});

describe('validate', () => {
  it('accepts all built-in combinations', () => {
    for (const t of themes) for (const l of limbSets) expect(() => validate(t, l)).not.toThrow();
  });

  it('rejects duplicate ids', () => {
    const bad = { ...halloween, spaces: [halloween.spaces[0], halloween.spaces[0]] };
    expect(() => validate(bad, standard)).toThrow(/duplicate/);
  });
});
