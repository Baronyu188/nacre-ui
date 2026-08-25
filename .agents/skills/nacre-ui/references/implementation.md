# Implementation guide

## Repository map

- `src/ui/`: public React components.
- `src/ui/index.ts`: the public export surface and single CSS import.
- `src/ui/theme.css`: shared tokens, materials, states, and motion.
- `src/demo/`: gallery only; never import demo code into the library.
- `vite.lib.config.ts` and `tsconfig.lib.json`: ESM, CSS, and declaration builds.

## Extend a component

1. Search for an existing component, token, spring, and caller.
2. Add behavior with React Aria Components before custom keyboard or focus code.
3. Use Motion only for shared-layout, presence, or spring behavior that CSS cannot express cleanly.
4. Add public props and types next to the component. Keep demo-only state in `src/demo`.
5. Export the component from `src/ui/index.ts` and add it to the package export check.

## Styling

- Prefix classes with `nacre-` and demo-only classes with `demo-`.
- Reuse root variables before adding a token. Add a token only when the value is shared or user-configurable.
- A glass component gets one material fill, one blur, one short shadow, and one masked rim. Set `border: 0` when the rim pseudo-element is present.
- Keep theme-dependent values in variables. Use `currentColor` for SVG icons.
- Portaled overlays inherit tokens from `document.documentElement`, not a nested app wrapper.

## Pointer performance

Sample pointer motion through `requestAnimationFrame` and update CSS variables directly. Do not set React state on every pointer move. Cap translation and clear it on pointer leave or lost capture. Use `will-change` only on elements that actually animate.

## Accessibility

Preserve React Aria roles and state attributes. Keep visible `:focus-visible` rings, labels for icon-only buttons, at least 44px touch targets where practical, and single-line truncation where the component contract requires it.

## Build checks

Run:

```bash
npm run check
npm run build:lib
npm run verify:package
```

The package must emit `dist-lib/index.js`, `dist-lib/nacre.css`, and `dist-lib/types/index.d.ts`. React and ReactDOM remain peer dependencies.
