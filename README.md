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
    { id: 'jack-o-lantern', label: "Jack-o'-Lantern", color: '#ff7518', icon: '🎃' },
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

## Offline use

The app is a PWA: after the first visit, a service worker keeps a copy on the device so it opens and spins with no connection. Use **Add to Home Screen** (Safari share menu, or Chrome's menu) to install it with its own icon.

After a new version is deployed, the device picks it up the next time the app is opened online, and uses it from the following launch.

**iPhone note:** a home-screen app on iOS keeps its own storage, separate from Safari, so the offline copy saved while browsing in Safari doesn't carry over. After adding it to the home screen:

1. With internet on, open the app from the home-screen icon and wait a few seconds after the wheel appears.
2. Close it fully (swipe it away in the app switcher), then open it from the icon once more, still online.
3. It now works offline. If the icon opens with Safari's address bar showing, it was added with **Open as Web App** turned off; remove it and add it again with that on.

## Deploying

`.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
