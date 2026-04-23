# FileField multi-select support — design

**Date:** 2026-04-23
**Package:** `@comet/cms-admin`
**Component:** `FileField` (`packages/admin/cms-admin/src/form/file/FileField.tsx`)

## Goal

Enable users to select multiple DAM files through `FileField`. Selection happens via the datagrid checkboxes inside the existing `ChooseFileDialog`; a "Change selected files" button reopens the dialog pre-seeded with the current value. The existing single-file API stays fully backwards compatible.

## Non-goals

- Server-side changes. Multi-select is purely a client/admin concern — callers decide how to persist an array of files.
- Recursive folder expansion. Folders never contribute files to the selection.
- "Select all across all pages." The native MUI X header checkbox (current-page semantics) is sufficient.

## Scope decisions (from brainstorming)

| Question | Decision |
| --- | --- |
| API shape | Extend `FileField` with `multiple?: boolean`; overload props/value. No sibling component. |
| Empty→selected visual | Stacked list following the list-block row pattern, one row per file. |
| Dialog on "Change selected files" | Dialog pre-checks current value; confirming **replaces** the entire selection. |
| "Select all" scope | Current page only (native DataGrid header checkbox). |
| Folders in the multi-select dialog | Folder row checkboxes are non-interactable; only files are selectable. |
| Reordering | Drag-to-reorder via `react-dnd`, using the existing `BlockRow` pattern. |
| `preview` in multi mode | Becomes `(file) => ReactNode` per row. Single mode keeps `ReactNode`. |

## Public API

```ts
type SingleFileFieldProps = FieldRenderProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> & {
    multiple?: false;
    buttonText?: ReactNode;
    allowedMimetypes?: string[];
    preview?: ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
};

type MultiFileFieldProps = FieldRenderProps<GQLDamFileFieldFileFragment[] | undefined, HTMLInputElement> & {
    multiple: true;
    buttonText?: ReactNode;
    allowedMimetypes?: string[];
    preview?: (file: GQLDamFileFieldFileFragment) => ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
};

export function FileField(props: SingleFileFieldProps): ReactElement;
export function FileField(props: MultiFileFieldProps): ReactElement;
```

Discriminated via overload so TypeScript rejects a static `preview` in multi mode and an array value in single mode. Consumers that don't pass `multiple` (or pass `false`) keep their exact current types. `menuActions` remains the same shape in both modes; in multi mode it applies per row.

## Rendering

### Single mode (unchanged)

The existing render path is unchanged and becomes the `multiple !== true` branch. No behavioral or visual differences.

### Multi mode

When `multiple === true`:

- **Empty state:** one `BlockAdminComponentButton` (same visual as today) with `buttonText ?? <FormattedMessage … defaultMessage="Choose files" />`. Opens `ChooseFilesDialog`.
- **Populated state:** a vertical stack of `FileFieldRow` components — one per file — followed by a single `BlockAdminComponentButton` labelled `<FormattedMessage … defaultMessage="Change selected files" />`. The stack is wrapped in a container that mirrors `BlockAdminComponentPaper` visuals so it reads as one grouped control.

Empty array after removals becomes `undefined` via `input.onChange(undefined)` so the field can be cleared cleanly.

### `FileFieldRow` (new internal component)

Modelled on `packages/admin/cms-admin/src/blocks/common/blockRow/BlockRow.tsx` but **without** copy/paste, insert-between, visibility toggle, or validity icon. Structure:

- **Drag handle** (left) — `react-dnd` `useDrag`/`useDrop`, item type `"fileFieldFile"` (unique string to avoid colliding with `BlockRow`'s `"block"` item type). Hover logic copied from `BlockRow` (midpoint-crossing, mutate monitor item for performance).
- **Content** (center) — `preview(file)` when provided, `Typography` for `file.name`, `DamPathLazy` for the folder path.
- **Menu** (right) — `MoreVertical` icon button opening a `Menu` with:
    - "Open in DAM" (when `entityDependencyMap["DamFile"]` exists) — identical logic to the current single-file menu item.
    - Any items the caller passed through `menuActions` (same rendering rules as today).
    - A `Remove` item at the bottom, divided off — calls the row's `onRemove`.

Reordering updates `input.onChange(reorderedFiles)`. Remove updates `input.onChange(files.filter(…))` or `input.onChange(undefined)` for the last item.

### `DndProvider` dependency

`react-dnd` requires a `DndProvider` ancestor. Block editing already wraps its editor in a provider; when `FileField` is used outside a block editor (e.g. a plain admin form), no provider may exist. Implementation step: detect this and either rely on a root-level provider in consuming apps, or conditionally wrap the multi-mode tree in a `DndProvider` with `HTML5Backend`. The approach is verified at implementation time; if a local provider is needed, nested providers of the same backend are safe in react-dnd 16+.

## Dialog

### `ChooseFileDialog` (existing, unchanged)

Used in single mode. Click-row-to-select calls `onChooseFile(fileId)` and closes the dialog. No confirm button. API unchanged — no existing callers are affected.

### `ChooseFilesDialog` (new, plural)

Used in multi mode.

```ts
interface ChooseFilesDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (fileIds: string[]) => void;
    initialFileIds: string[];
    allowedMimetypes?: string[];
}
```

Behavior:

1. On open, initialize an internal `selectionMap: DamItemSelectionMap` state with each `initialFileIds` id mapped to `"file"`.
2. Render `DamScopeProvider` → `MemoryRouter` → `SubRoute` → `RedirectToPersistedDamLocation` → `DamTable` (same skeleton as `ChooseFileDialog`).
3. Pass `selectionMap` + `onSelectionChange` (controlled) and `disableFolderSelection` to `DamTable`. Do not pass a custom `renderDamLabel` — default label behavior (navigate into folders, display file rows) is sufficient since row clicks no longer need to pick a single file.
4. Render `Apply` and `Cancel` buttons in the `Dialog`'s action area. Apply calls `onConfirm(Array.from(selectionMap.keys()))`.
5. "Select all" on the current page is the native MUI X DataGrid header checkbox, enabled by `hideMultiselect={false}`.

Shared dialog skeleton (Dialog + DamScopeProvider + MemoryRouter + SubRoute + RedirectToPersistedDamLocation) is extracted into a small internal helper to avoid duplication between the two dialog components.

On confirm in `FileField`:

- Reuse already-selected files from the current `input.value` by id without re-fetching.
- For newly-added ids, fetch the full fragment. Today's single-file path uses `damFileFieldFileQuery($id: ID!)`; for multi-select we run it once per new id in parallel (`Promise.all`). A batched `damFileFieldFiles($ids: [ID!]!)` query can be added as a follow-up optimization if N+1 proves costly in practice — out of scope for this change.
- `input.onChange(newArray)` replaces the value.

## `DamTable` / `FolderDataGrid` changes

Add three **optional** props to `DamTable` (all backwards compatible):

- `selectionMap?: DamItemSelectionMap`
- `onSelectionChange?: (next: DamItemSelectionMap) => void`
- `disableFolderSelection?: boolean`

Threaded through to `FolderDataGrid`:

- When `selectionMap` + `onSelectionChange` are both provided, the DataGrid operates in **controlled** mode: `rowSelectionModel` uses the prop, `onRowSelectionModelChange` calls `onSelectionChange` instead of `damSelectionActionsApi.setSelectionMap`.
- When either is absent, the DataGrid keeps current behavior (driven by `DamSelectionProvider`'s internal state).
- When `disableFolderSelection` is `true`, set `isRowSelectable={({ row }) => isFile(row)}` on the DataGrid. Folder checkboxes become uninteractable and `Select all` (header checkbox) picks only file rows on the current page.

`DamSelectionProvider`, `DamSelectionContext`, and the bulk actions (`deleteSelected`, `archiveSelected`, `moveSelected`, `downloadSelected`, `restoreSelected`) are untouched. `ChooseFilesDialog` does not need them.

## Value dataflow

```
FileField (multi)
  │
  ├── input.value: GQLDamFileFieldFileFragment[] | undefined
  │       │
  │       ├── rendered as stacked FileFieldRow list
  │       ├── drag reorder → input.onChange(reordered[])
  │       └── row remove → input.onChange(filtered[] | undefined)
  │
  └── "Change selected files" button
          │
          ▼
      ChooseFilesDialog
          │ initialFileIds = input.value.map(f => f.id)
          │
          ├── internal selectionMap state
          ├── controlled DamTable (checkboxes; folders non-selectable)
          │
          └── on Apply(ids)
                │
                ├── fetch missing fragments via damFileFieldFileQuery
                ├── preserve order of ids as returned from dialog
                └── input.onChange(newArray)
```

## Testing

`@comet/cms-admin` uses Vitest + jsdom with `@testing-library/react`. Planned tests in `packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx`:

1. **Single mode regression** — renders `BlockAdminComponentButton` when value is `undefined`; renders current single-file paper when value is a fragment; "Empty" clears the value. (Ensures zero behavior drift.)
2. **Multi mode — empty state** — renders "Choose files" button; clicking opens `ChooseFilesDialog`.
3. **Multi mode — dialog confirm** — given an initial value of `[fileA]`, user adds `fileB` in the dialog, applies → `input.onChange` called with `[fileA, fileB]` in id order.
4. **Multi mode — remove** — given `[fileA, fileB]`, clicking remove on `fileA` row → `input.onChange([fileB])`; removing the last file → `input.onChange(undefined)`.
5. **Multi mode — reorder** — programmatically trigger `moveFile(0, 1)` exposed by the row (or simulate dnd via `react-dnd-test-utils`) → `input.onChange` called with swapped order.
6. **Type-level** — compile-time fixture file asserts `multiple: true` requires an array value and a function `preview`, while `multiple: false`/omitted requires a single value and `ReactNode` preview.

Manual verification in `demo-admin`: extend or add a demo block that uses `FileField multiple` to exercise drag-reorder and dialog pre-seeding end-to-end.

## Changeset

`@comet/cms-admin`: **minor**.

````md
---
"@comet/cms-admin": minor
---

Add `multiple` prop to `FileField` for selecting multiple DAM files

`FileField` now accepts `multiple={true}` to select a list of DAM files instead of a single file. Multi-file values are `GQLDamFileFieldFileFragment[]`; the component renders a stacked, reorderable list of files with per-row menu and remove actions. The picker dialog pre-checks the current selection and replaces the value on confirm. The existing single-file API is unchanged.

**Example**

```tsx
<Field name="files" component={FileField} multiple preview={(file) => <Thumbnail fileId={file.id} />} />
```
````

## File touch list

- `packages/admin/cms-admin/src/form/file/FileField.tsx` — overloaded signature; multi-mode branch; wiring.
- `packages/admin/cms-admin/src/form/file/FileFieldRow.tsx` (new) — per-file stacked row with dnd + menu + remove.
- `packages/admin/cms-admin/src/form/file/chooseFile/ChooseFilesDialog.tsx` (new) — multi-mode dialog.
- `packages/admin/cms-admin/src/form/file/chooseFile/chooseFileDialogSkeleton.tsx` (new, optional) — shared scaffold if extraction is worthwhile.
- `packages/admin/cms-admin/src/dam/DamTable.tsx` — add three optional props.
- `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx` — accept and honor the controlled selection + `disableFolderSelection`.
- `packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx` (new) — unit tests.
- `.changeset/filefield-multiselect.md` (new) — changeset.

## Risks and mitigations

- **Nested `DndProvider`.** react-dnd 16 supports nested providers of the same backend; if `FileField` ends up rendered inside and outside of existing block-editor dnd trees, confirm no duplicate-registration warnings. Mitigation: lazy-mount a provider only when one is missing (react-dnd exposes context to check).
- **Dialog de-duplication.** Extracting a shared skeleton between `ChooseFileDialog` and `ChooseFilesDialog` should not change the single-file dialog's behavior. If extraction is too invasive, keep two similar but independent components — duplication is fine here.
- **`DamTable` controlled/uncontrolled mode.** Existing callers that don't pass `selectionMap`/`onSelectionChange` must not regress. The controlled path is gated on both props being present; anything else falls through to the current `DamSelectionProvider`-driven path.
- **Order stability.** When the user confirms in the dialog, we want the output array ordered by id insertion order of the dialog's selection. MUI X `GridRowSelectionModel` uses a `Set` but preserves insertion order, which matches our needs. Tests assert ordering.
