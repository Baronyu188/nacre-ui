# Component catalog

Import all public components from `@nacre-ui/react`.

## Material and actions

- `Button`: default, `prominent`, `glass`, and `quiet` actions. Use `prominent` only for the primary action.
- `LiquidGlassButton`: compact pointer-responsive liquid action with bounded drag deformation.
- `GlassSurface`, `GlassGroup`: glass container and compact grouped controls.
- `LiquidGlassSurface`: specialized interactive glass surface; keep content short.
- `PerspectiveCard`: optional low-amplitude pointer depth for visual previews.
- `CloseIcon`: centered SVG close mark for dismiss controls.

## Selection and forms

- `Field`, `TextAreaField`, `SearchInput`, `PasswordField`, `NativeDateInput`.
- `Select`, `ComboBox`: single-line triggers with liquid menu emergence.
- `Switch`, `Checkbox`, `Range`, `NumberInput`, `RadioCards`, `Tags`.
- `Tabs`, `SegmentedControl`: moving shared selection lens; prefer `Tabs` when panels change.

## Navigation and application chrome

- `DesktopNavigation`: floating 5%-fill blurred sidebar with neutral glass selection and optional controlled hide action.
- `MobileNavigation`: translucent bottom navigation with shared spring lens and optional separate action.
- `BreadcrumbTrail`, `ActionMenu`, `MenuBar`, `MenuButton`, `ContextMenu`, `Toolbar`, `Pagination`, `FileDrop`, `ColorPicker`.

## Structure, overlays, and feedback

- `Accordion`: animated disclosure with continuous height and color transitions.
- `InfoPopover`, `Hint`: lightweight anchored information.
- `Presentation`: opaque `dialog` or four-direction `drawer`; children provide their own actions.
- `AdaptiveSheet`: controlled four-direction sheet with scrolling body, fixed footer, and independent mobile placement.
- `AlertDialog`: dedicated confirmation for destructive or irreversible actions.
- `CommandPalette`: controlled searchable command surface with keyboard-ready list actions.
- `NotificationCenter` / `NotificationFlyout`: notification drawer with dismissible glass notification rows.
- `Toast`: transient success, failure, warning, and undo feedback through the exported `toastQueue`.
- `Progress`: determinate with `value`, or indeterminate with `isIndeterminate`.
- `MeterBar`, `Badge`, `Notice`, `Skeleton`.

## Content and data

- `Card`, `CardSkeleton`: content, media, and metric presets with matching skeletons.
- `SettingsCard`: grouped settings rows with optional icon, value, control, or disclosure action.
- `DataTable`: structured selectable data; selection remains neutral gray.
- `Avatar`, `StatusDot`, `Kbd`, `Separator`, `EmptyState`.

## Chat and agents

- `ConversationList`: selectable conversation summary list with optional avatar, timestamp, and unread count.
- `ChatMessage`: user, assistant, and system bubbles with rich React content and optional actions.
- `ChatComposer`: contenteditable rich-text composer with formatting and leading/trailing control slots.
- `AgentComposer`: agent-oriented composer preset with attachment, tool, model, voice, and send controls.
- `AgentThinking`: dots, wave, and orbit status animations.
- `AgentProgressSidebar`: compact ordered task progress with complete, active, pending, and error states.

## Composition rules

- Prefer one component that owns behavior over nested ad-hoc buttons and divs.
- Pass application copy and data through props; do not copy demo-specific Chinese labels into primitives.
- Keep icons as centered SVGs with `currentColor` unless the icon is a brand asset.
- Put stable inputs inside opaque panels; float only their menus or tool surfaces.
