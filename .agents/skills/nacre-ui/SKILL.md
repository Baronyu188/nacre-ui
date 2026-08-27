---
name: nacre-ui
description: Build, extend, or review React interfaces with the Nacre UI component library and its restrained liquid-glass material, single-rim highlights, elastic motion, blue theme tokens, and accessibility rules. Use for work inside this repository or when integrating @nacre-ui/react; do not use for unrelated generic React styling.
---

# Nacre UI

Use the exported components before writing new primitives. Import components from `@nacre-ui/react` and load `@nacre-ui/react/styles.css` once at the application root.

## Route the task

- Read [references/design-language.md](references/design-language.md) before changing material, color, spacing, type, highlights, or motion.
- Read [references/component-catalog.md](references/component-catalog.md) when selecting, composing, or adding a component.
- Read [references/implementation.md](references/implementation.md) when editing source, tokens, portals, exports, performance, or package setup.

## Invariants

- Keep stable content surfaces opaque and readable. Reserve glass for controls, navigation, selection lenses, menus, and temporary overlays.
- When controls sit over photography or another complex scene, place the group on one borderless, moderately opaque blurred support surface. It must improve label stability without adding a rim or edge highlight.
- Render exactly one one-pixel rim per glass boundary. Never stack a CSS border with a masked highlight on the same edge.
- Use `--nacre-accent` and `--nacre-accent-rgb`; do not hard-code blue into reusable component states.
- Keep selection neutral unless it represents a primary action. Theme color is a variable, not wallpaper.
- Reuse React Aria Components for behavior and Motion springs for shared moving indicators.
- Preserve keyboard focus, touch targets, portal inheritance, and reduced-motion behavior.

Inspect the component implementation and nearby callers before editing a shared primitive. Fix a material or motion issue once at its shared source.
