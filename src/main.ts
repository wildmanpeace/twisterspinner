import './style.css';
import { limbSets } from './limbs';
import { sliceCount, spin, targetRotation, validate, type SpinResult } from './spin';
import { themes } from './themes';
import type { LimbSet, Theme } from './types';
import { renderWheel } from './wheel';

const STORAGE_KEY = 'twisterspinner:selection';
const SPIN_MS = 4000;

const themeSelect = document.querySelector<HTMLSelectElement>('#theme-select')!;
const limbsSelect = document.querySelector<HTMLSelectElement>('#limbs-select')!;
const rotor = document.querySelector<HTMLDivElement>('#rotor')!;
const resultEl = document.querySelector<HTMLDivElement>('#result')!;
const spinButton = document.querySelector<HTMLButtonElement>('#spin')!;

let theme: Theme = themes[0];
let limbSet: LimbSet = limbSets[0];
let rotation = 0;
let spinning = false;

function fillSelect(select: HTMLSelectElement, items: { id: string; name: string }[]) {
  select.replaceChildren(...items.map((i) => new Option(i.name, i.id)));
}

function loadSelection() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    theme = themes.find((t) => t.id === saved.theme) ?? theme;
    limbSet = limbSets.find((l) => l.id === saved.limbs) ?? limbSet;
  } catch {
    // Storage unavailable or corrupt; fall back to defaults.
  }
}

function saveSelection() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: theme.id, limbs: limbSet.id }));
  } catch {
    // Ignore; remembering the selection is only a convenience.
  }
}

function applyTheme() {
  const { look } = theme;
  const root = document.documentElement.style;
  root.setProperty('--bg', look.background);
  root.setProperty('--fg', look.foreground);
  root.setProperty('--accent', look.accent);
  root.setProperty('--font', look.fontFamily ?? 'system-ui, sans-serif');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', look.background);
}

function redraw() {
  validate(theme, limbSet);
  applyTheme();
  rotation = 0;
  rotor.style.transition = 'none';
  rotor.style.transform = 'rotate(0deg)';
  rotor.replaceChildren(renderWheel(theme, limbSet));
  resultEl.replaceChildren();
}

function showResult({ limb, space }: SpinResult) {
  const swatch = document.createElement('span');
  swatch.className = 'swatch';
  swatch.style.background = space.color;
  if (space.stroke) swatch.style.borderColor = space.stroke;
  swatch.textContent = space.icon ?? '';

  const limbText = document.createElement('span');
  limbText.className = 'result-limb';
  limbText.textContent = `${limb.icon ?? ''} ${limb.label}`.trim();

  const spaceText = document.createElement('span');
  spaceText.className = 'result-space';
  spaceText.textContent = space.label;

  resultEl.replaceChildren(limbText, swatch, spaceText);
}

function doSpin() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = themeSelect.disabled = limbsSelect.disabled = true;
  resultEl.replaceChildren();

  const result = spin(theme, limbSet);
  const turns = 4 + Math.floor(Math.random() * 3);
  const jitter = Math.random() - 0.5;
  rotation = targetRotation(rotation, result.slice, sliceCount(theme, limbSet), turns, jitter);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ms = reduceMotion ? 300 : SPIN_MS;
  rotor.style.transition = `transform ${ms}ms cubic-bezier(0.15, 0.7, 0.2, 1)`;
  rotor.style.transform = `rotate(${rotation}deg)`;

  window.setTimeout(() => {
    spinning = false;
    spinButton.disabled = themeSelect.disabled = limbsSelect.disabled = false;
    showResult(result);
  }, ms);
}

/** Keep the screen on during a game so the phone doesn't lock between spins. */
async function keepAwake() {
  try {
    await navigator.wakeLock?.request('screen');
  } catch {
    // Not supported or denied; not essential.
  }
}

fillSelect(themeSelect, themes);
fillSelect(limbsSelect, limbSets);
loadSelection();
themeSelect.value = theme.id;
limbsSelect.value = limbSet.id;
redraw();

themeSelect.addEventListener('change', () => {
  theme = themes.find((t) => t.id === themeSelect.value)!;
  saveSelection();
  redraw();
});
limbsSelect.addEventListener('change', () => {
  limbSet = limbSets.find((l) => l.id === limbsSelect.value)!;
  saveSelection();
  redraw();
});
spinButton.addEventListener('click', () => {
  keepAwake();
  doSpin();
});
rotor.addEventListener('click', () => {
  keepAwake();
  doSpin();
});
document.addEventListener('visibilitychange', () => {
  // The browser drops the wake lock when the page is hidden.
  if (document.visibilityState === 'visible') keepAwake();
});
