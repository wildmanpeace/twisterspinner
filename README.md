# twisterspinner

A quick web-based Twister spinner with swappable themes and a kids difficulty mode.

## Running locally

```bash
npm install
npm run dev
```

`npm test` runs the spinner logic tests and `npm run build` writes the static site to `dist/`.

## Themes

Each theme lives in its own file in `src/themes/`. A theme sets the spaces on the wheel (label, color, optional emoji icon) and the look of the page:

```ts
const halloween: Theme = {
  id: 'halloween',
  name: 'Halloween',
  spaces: [
    { id: 'pumpkin', label: 'Pumpkin', color: '#ff7518', icon: '🎃' },
    { id: 'ghost', label: 'Ghost', color: '#0a0a0a', icon: '👻', stroke: '#f2f2f2' },
    // ...
  ],
  look: { background: '#1b1026', foreground: '#f7efe2', accent: '#ff7518', ... },
};
```

To add a theme, copy an existing file, edit it, and add it to the list in `src/themes/index.ts`. The wheel is drawn from the config, so any number of spaces works. All fields are described in `src/types.ts`.

## Difficulty

Difficulty is set by the limb set in `src/limbs.ts`:

- **Standard:** Left Hand, Right Hand, Left Foot, Right Foot
- **Kids:** Hand, Foot

Any theme can be played at any difficulty.

## Deploying

`.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
