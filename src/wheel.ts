import type { LimbSet, Theme } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

const HUB_R = 20;
const LIMB_R = 56;
const OUTER_R = 94;

/** Point at radius r, angle deg measured clockwise from 12 o'clock. */
function polar(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];
}

/** Ring segment between two radii and two angles. */
function arcPath(r0: number, r1: number, a0: number, a1: number): string {
  // A full circle can't be drawn as one arc, so split it in two.
  if (a1 - a0 >= 360) {
    const mid = a0 + 180;
    return arcPath(r0, r1, a0, mid) + arcPath(r0, r1, mid, a1);
  }
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  return (
    `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} ` +
    `L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`
  );
}

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  text?: string,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Text placed at (r, deg) and rotated so it reads outward from the center. */
function label(r: number, deg: number, size: number, fill: string, text: string): SVGTextElement {
  const [x, y] = polar(r, deg);
  return el(
    'text',
    {
      x,
      y,
      'font-size': size,
      fill,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      transform: `rotate(${deg} ${x} ${y})`,
    },
    text,
  );
}

/**
 * Draws the wheel: an outer ring of space slices grouped by limb, and an inner
 * ring naming the limb for each group. Slice i starts at i * (360 / slices) degrees.
 */
export function renderWheel(theme: Theme, limbSet: LimbSet): SVGSVGElement {
  const { spaces, look } = theme;
  const { limbs } = limbSet;
  const sliceDeg = 360 / (spaces.length * limbs.length);
  const limbDeg = 360 / limbs.length;

  const svg = el('svg', {
    viewBox: '-100 -100 200 200',
    role: 'img',
    'aria-label': `${theme.name} spinner, ${limbSet.name} difficulty`,
  });

  svg.append(el('circle', { r: 99, fill: look.wheelBorder }));

  limbs.forEach((limb, li) => {
    const a0 = li * limbDeg;
    const a1 = a0 + limbDeg;

    spaces.forEach((space, si) => {
      const s0 = a0 + si * sliceDeg;
      const mid = s0 + sliceDeg / 2;
      svg.append(
        el('path', {
          d: arcPath(LIMB_R, OUTER_R, s0, s0 + sliceDeg),
          fill: space.color,
          stroke: space.stroke ?? look.wheelBorder,
          'stroke-width': space.stroke ? 1.2 : 0.8,
          'stroke-linejoin': 'round',
        }),
      );
      if (space.icon) {
        const size = Math.min(16, sliceDeg * 0.6);
        svg.append(label((LIMB_R + OUTER_R) / 2, mid, size, look.foreground, space.icon));
      }
    });

    const mid = a0 + limbDeg / 2;
    svg.append(
      el('path', { d: arcPath(HUB_R, LIMB_R, a0, a1), fill: look.limbRing[li % 2] }),
    );
    if (limb.icon) svg.append(label(46, mid, 12, look.limbText, limb.icon));
    svg.append(label(32, mid, 7, look.limbText, limb.label));

    // Divider between limb groups.
    if (limbs.length > 1) {
      const [x0, y0] = polar(HUB_R, a0);
      const [x1, y1] = polar(OUTER_R, a0);
      svg.append(
        el('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: look.wheelBorder, 'stroke-width': 2.5 }),
      );
    }
  });

  svg.append(el('circle', { r: HUB_R, fill: look.wheelBorder }));
  svg.append(el('circle', { r: HUB_R - 6, fill: look.accent }));

  return svg;
}
