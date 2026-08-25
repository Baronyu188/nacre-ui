# Nacre design language

## Identity

Nacre combines Apple-like restraint and spacing with a proprietary liquid interaction language. It is soft, modern, rounded, and spatial. It is not flat minimalism, nostalgic skeuomorphism, Y2K gloss, purple cyberpunk, or an all-glass content canvas.

## Material hierarchy

1. Stable content surfaces carry text, forms, data, cards, dialogs, and drawers. Use `--nacre-surface` or `--nacre-surface-solid` so content remains calm and readable.
2. Functional glass covers buttons, tabs, segmented controls, navigation, menus, toolbars, and small temporary overlays.
3. Liquid glass adds interaction to compact controls. Do not apply deformation to large reading surfaces.

Navigation glass uses a low-opacity fill over a strong blur. Desktop sidebars use `--nacre-navigation-fill` at 5%. Mobile navigation uses the slightly deeper `--nacre-mobile-navigation-fill`. Selected navigation lenses are more opaque than their container while remaining translucent.

## Edge highlight

Every glass boundary has one outer, one-pixel masked rim. The light source is fixed toward the upper left. The upper-left and lower-right arcs can be lighter; the upper-right and lower-left arcs stay quieter. Use `--nacre-button-rim` for compact controls and `--nacre-rim` for general glass.

Do not combine the masked rim with `border`, inset strokes, or a second pseudo-element on the same boundary. Avoid broad white bands, full-perimeter glow, outer bloom, and abrupt light-dark seams. Shadows are short and low-opacity; they establish lift without creating another visible outline.

## Color

- Primary accent: `--nacre-accent`, default `#0a84ff`.
- Accent channels: `--nacre-accent-rgb`, used for translucent focus and active states.
- Text: `--nacre-ink`; secondary text: `--nacre-muted`.
- Neutral selected rows, list options, tables, and radio cards remain gray unless they are primary actions.
- Avoid purple, blue-purple, green-purple, and uncontrolled accent spread.

When theme color changes, set both accent variables on `document.documentElement` so React Aria portals inherit them.

## Shape, type, and spacing

- One-line controls share `--nacre-control-height: 46px` unless an icon-only control has a deliberate square size.
- Use concentric rounded corners. Pills are reserved for controls and moving lenses; panels use `--nacre-radius-md` through `--nacre-radius-xl`.
- Default text uses the system/SF-compatible stack already defined in `theme.css`.
- Labels and menu options are single-line, regular weight, and vertically centered.
- Favor generous outer breathing room and compact internal grouping. Floating panels do not touch viewport or preview edges.

## Motion grammar

- Press: brighten locally, grow slightly, and pull at most a few pixels toward the pointer. Release with a short spring. Never twist or stretch aggressively.
- Drag: cap liquid-button movement at about 6px horizontally and 4px vertically. Pointer capture must always reset on up, cancel, leave, and lost capture.
- Tabs and mobile navigation: use one shared Motion `layoutId` lens with the existing spring (`stiffness 310`, `damping 21`, `mass .72`) and the `nacre-tab-jelly` pulse.
- Menus: emerge below the trigger with a quick droplet-to-panel morph, short blur-to-focus, then a restrained overshoot. Options stay single-line and use a neutral sliding hover track.
- Menu hover: the whole menu may scale and lean slightly toward the pointer. Reset gradually with the existing spring-like easing.
- Dialogs: short fade and scale. Do not use the menu droplet morph.
- Drawers: slide from the edge with a mild, soft overshoot. Do not make the drawer itself transparent glass.
- Notifications: remove with simultaneous height, opacity, blur, and horizontal-collapse animation.

Honor `prefers-reduced-motion` by removing nonessential travel and spring overshoot while preserving state clarity.

## Avoid

- Double borders or double highlights.
- Static interior highlight bands through transparent controls.
- Cursor-following glare on idle buttons.
- Theme-colored neutral selections.
- Large Gaussian glow fields or heavy card shadows.
- Glass behind long-form reading content.
- Browser-experimental-only rendering as the sole implementation.
