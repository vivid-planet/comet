# FileField multi-select Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `multiple` prop to `FileField` so consumers can select a list of DAM files via the existing `ChooseFileDialog`, rendering selected files as a reorderable stacked list. Fully backwards compatible with existing single-file callers.

**Architecture:** Extend `FileField` with an overloaded `multiple?: boolean` prop. In multi mode, render a stack of `FileFieldRow` components (a lighter variant of the existing `BlockRow`) with `react-dnd` reorder; below the stack, a single "Change selected files" button opens a new `ChooseFilesDialog` that pre-checks the current value and replaces it on confirm. The dialog reuses `DamTable` via three new optional controlled-selection props, which are wired through `FolderDataGrid` without touching `DamSelectionProvider`.

**Tech Stack:** React, TypeScript, `react-final-form` (FieldRenderProps), MUI + MUI X DataGrid, react-dnd (existing pattern), Apollo Client, Vitest + jsdom + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-04-23-filefield-multiselect-design.md`

---

## File structure

**Create:**

- `packages/admin/cms-admin/src/form/file/FileFieldRow.tsx` — stacked row for a single selected file in multi mode. Drag handle (`react-dnd`) + preview + name/path + menu + remove.
- `packages/admin/cms-admin/src/form/file/FileFieldRow.sc.ts` — styled primitives for the row (mirrors `BlockRow.sc.ts` but trimmed).
- `packages/admin/cms-admin/src/form/file/chooseFile/ChooseFilesDialog.tsx` — multi-select dialog with controlled selection + Apply/Cancel buttons.
- `packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx` — unit tests for single + multi modes.
- `packages/admin/cms-admin/src/form/file/__tests__/FileFieldRow.test.tsx` — unit tests for the row component.
- `.changeset/filefield-multi-select.md` — changeset (minor bump for `@comet/cms-admin`).

**Modify:**

- `packages/admin/cms-admin/src/form/file/FileField.tsx` — overloaded signature, multi-mode branch, wiring to `ChooseFilesDialog` + `FileFieldRow`.
- `packages/admin/cms-admin/src/dam/DamTable.tsx` — add three optional props: `selectionMap`, `onSelectionChange`, `disableFolderSelection`; thread through to `FolderDataGrid`.
- `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx` — honor controlled selection when provided; set `isRowSelectable` when `disableFolderSelection` is true.

Single responsibility per file; existing `DamSelectionContext` / `DamSelectionProvider` are untouched.

---

## Task 1: Add `disableFolderSelection` prop to `DamTable`/`FolderDataGrid`

This is additive and independently verifiable. Start here to lay the lowest-risk groundwork.

**Files:**

- Modify: `packages/admin/cms-admin/src/dam/DamTable.tsx`
- Modify: `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx`

- [ ] **Step 1: Add prop to `DamConfig` and thread through `DamTable`**

In `packages/admin/cms-admin/src/dam/DamTable.tsx`, add `disableFolderSelection?: boolean` to the `DamConfig` interface (around line 80), and default it to `false` in `propsWithDefaultValues` (around line 98).

```ts
export interface DamConfig {
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: RenderDamLabelOptions) => ReactNode;
    hideArchiveFilter?: boolean;
    hideContextMenu?: boolean;
    allowedMimetypes?: string[];
    contentScopeIndicator?: ReactNode;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
    additionalToolbarItems?: ReactNode;
    disableFolderSelection?: boolean;
}
```

```ts
const propsWithDefaultValues = {
    hideContextMenu: false,
    hideMultiselect: false,
    hideDamActions: false,
    hideArchiveFilter: false,
    disableFolderSelection: false,
    ...damConfigProps,
};
```

- [ ] **Step 2: Honor prop in `FolderDataGrid`**

In `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx`, destructure `disableFolderSelection` at line 142–151, then on the `DataGrid` element (around line 648), pass `isRowSelectable`:

```tsx
const FolderDataGrid = ({
    id: currentFolderId,
    filterApi,
    breadcrumbs,
    hideContextMenu = false,
    hideArchiveFilter,
    hideMultiselect,
    disableFolderSelection,
    renderDamLabel,
    ...props
}: FolderDataGridProps) => {
```

```tsx
<DataGrid
    apiRef={apiRef}
    {...dataGridProps}
    rowHeight={58}
    rows={dataGridData?.damItemsList.nodes ?? []}
    rowCount={dataGridData?.damItemsList.totalCount ?? undefined}
    loading={loading}
    pageSizeOptions={[10, 20, 50]}
    getRowClassName={getRowClassName}
    columns={dataGridColumns}
    checkboxSelection={!hideMultiselect}
    isRowSelectable={disableFolderSelection ? ({ row }) => isFile(row) : undefined}
    rowSelectionModel={{ type: "include", ids: new Set(damSelectionActionsApi.selectionMap.keys()) }}
    onRowSelectionModelChange={handleSelectionModelChange}
    ...
```

Keep everything else on the element identical. `isFile` is already imported at the top of the file.

- [ ] **Step 3: Build and verify no regression**

Run: `pnpm --filter @comet/cms-admin run build`
Expected: Clean build, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add packages/admin/cms-admin/src/dam/DamTable.tsx packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx
git commit -m "cms-admin: add disableFolderSelection option to DamTable"
```

---

## Task 2: Add controlled selection props to `DamTable`/`FolderDataGrid`

**Files:**

- Modify: `packages/admin/cms-admin/src/dam/DamTable.tsx`
- Modify: `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx`

- [ ] **Step 1: Extend `DamConfig` with controlled-selection props**

In `packages/admin/cms-admin/src/dam/DamTable.tsx`, add two more optional props to `DamConfig`:

```ts
export interface DamConfig {
    renderDamLabel?: (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, options: RenderDamLabelOptions) => ReactNode;
    hideArchiveFilter?: boolean;
    hideContextMenu?: boolean;
    allowedMimetypes?: string[];
    contentScopeIndicator?: ReactNode;
    hideMultiselect?: boolean;
    hideDamActions?: boolean;
    additionalToolbarItems?: ReactNode;
    disableFolderSelection?: boolean;
    selectionMap?: DamItemSelectionMap;
    onSelectionChange?: (next: DamItemSelectionMap) => void;
}
```

`DamItemSelectionMap` is exported from `./DataGrid/FolderDataGrid`. Add this import at the top of `DamTable.tsx`:

```ts
import FolderDataGrid, { type DamItemSelectionMap, ... } from "./DataGrid/FolderDataGrid";
```

Or, if the `import` already imports other symbols from that path, extend the existing import.

- [ ] **Step 2: Thread controlled props through `FolderDataGrid`**

In `packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx`, destructure the new props in the component arguments:

```tsx
const FolderDataGrid = ({
    id: currentFolderId,
    filterApi,
    breadcrumbs,
    hideContextMenu = false,
    hideArchiveFilter,
    hideMultiselect,
    disableFolderSelection,
    selectionMap: selectionMapProp,
    onSelectionChange,
    renderDamLabel,
    ...props
}: FolderDataGridProps) => {
```

Just below the existing `const damSelectionActionsApi = useDamSelectionApi();` line, derive the effective selection + change handler:

```tsx
const isControlled = selectionMapProp !== undefined && onSelectionChange !== undefined;
const effectiveSelectionMap = isControlled ? selectionMapProp : damSelectionActionsApi.selectionMap;
```

Replace the existing `handleSelectionModelChange` (around lines 600–627) to route to the controlled handler when applicable:

```tsx
const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
    const newMap: DamItemSelectionMap = new Map();

    newSelectionModel.ids.forEach((selectedId) => {
        const typedId = selectedId as string;

        if (effectiveSelectionMap.has(typedId)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            newMap.set(typedId, effectiveSelectionMap.get(typedId)!);
        } else {
            const item = dataGridData?.damItemsList.nodes.find((item) => item.id === typedId);

            if (!item) {
                throw new Error("Selected item does not exist");
            }

            let type: "file" | "folder";
            if (item && isFolder(item)) {
                type = "folder";
            } else {
                type = "file";
            }
            newMap.set(typedId, type);
        }
    });

    if (isControlled) {
        onSelectionChange(newMap);
    } else {
        damSelectionActionsApi.setSelectionMap(newMap);
    }
};
```

Update the `DataGrid`'s `rowSelectionModel` prop to use `effectiveSelectionMap` (replace the existing prop at ~line 659):

```tsx
rowSelectionModel={{ type: "include", ids: new Set(effectiveSelectionMap.keys()) }}
```

- [ ] **Step 3: Update `FolderDataGridProps` interface**

Ensure `FolderDataGridProps extends DamConfig` continues to pick up the new props. The existing declaration at ~line 84 already extends `DamConfig`, so no change is needed — confirm by rebuilding.

- [ ] **Step 4: Build and verify**

Run: `pnpm --filter @comet/cms-admin run build`
Expected: Clean build.

- [ ] **Step 5: Commit**

```bash
git add packages/admin/cms-admin/src/dam/DamTable.tsx packages/admin/cms-admin/src/dam/DataGrid/FolderDataGrid.tsx
git commit -m "cms-admin: support controlled selection for DamTable"
```

---

## Task 3: Scaffold `ChooseFilesDialog`

**Files:**

- Create: `packages/admin/cms-admin/src/form/file/chooseFile/ChooseFilesDialog.tsx`

- [ ] **Step 1: Write the component**

Create `packages/admin/cms-admin/src/form/file/chooseFile/ChooseFilesDialog.tsx`:

```tsx
import { Button, Dialog, SaveButton, SubRoute } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { DamScopeProvider } from "../../../dam/config/DamScopeProvider";
import { useDamScope } from "../../../dam/config/useDamScope";
import { DamTable } from "../../../dam/DamTable";
import type { DamItemSelectionMap } from "../../../dam/DataGrid/FolderDataGrid";
import { useDamConfig } from "../../../dam/config/damConfig";
import { RedirectToPersistedDamLocation } from "./RedirectToPersistedDamLocation";

interface ChooseFilesDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (fileIds: string[]) => void;
    initialFileIds: string[];
    allowedMimetypes?: string[];
}

export const ChooseFilesDialog = ({ open, onClose, onConfirm, initialFileIds, allowedMimetypes }: ChooseFilesDialogProps) => {
    const damConfig = useDamConfig();
    const scope = useDamScope();

    let stateKey = "choose-files-dam-location";
    if (Object.keys(scope).length > 0) {
        stateKey = `${Object.values(scope).join("-")}-${stateKey}`;
    }

    const [selectionMap, setSelectionMap] = useState<DamItemSelectionMap>(new Map());

    useEffect(() => {
        if (open) {
            setSelectionMap(new Map(initialFileIds.map((id) => [id, "file"])));
        }
    }, [open, initialFileIds]);

    const handleConfirm = () => {
        const fileIds = Array.from(selectionMap.entries())
            .filter(([, type]) => type === "file")
            .map(([id]) => id);
        onConfirm(fileIds);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            title={<FormattedMessage id="comet.form.file.selectFiles" defaultMessage="Select files from DAM" />}
            slotProps={{
                root: {
                    PaperProps: {
                        sx: { height: "100%" },
                    },
                },
            }}
        >
            <DamScopeProvider>
                <MemoryRouter>
                    <SubRoute path="">
                        <RedirectToPersistedDamLocation stateKey={stateKey} />
                        <DamTable
                            allowedMimetypes={allowedMimetypes}
                            hideContextMenu={true}
                            hideMultiselect={false}
                            hideArchiveFilter={true}
                            disableFolderSelection={true}
                            selectionMap={selectionMap}
                            onSelectionChange={setSelectionMap}
                            additionalToolbarItems={damConfig.additionalToolbarItems}
                        />
                    </SubRoute>
                </MemoryRouter>
            </DamScopeProvider>
            <DialogActions>
                <Button variant="textLight" onClick={onClose}>
                    <FormattedMessage id="comet.generic.cancel" defaultMessage="Cancel" />
                </Button>
                <SaveButton variant="primary" onClick={handleConfirm} saving={false}>
                    <FormattedMessage id="comet.form.file.applyFileSelection" defaultMessage="Apply" />
                </SaveButton>
            </DialogActions>
        </Dialog>
    );
};
```

If `SaveButton` is not exported from `@comet/admin`, substitute `Button` with `variant="primary"` — confirm by checking `@comet/admin`'s `index.ts` during implementation.

- [ ] **Step 2: Build and verify imports**

Run: `pnpm --filter @comet/cms-admin run build`
Expected: Clean build, no unresolved imports.

- [ ] **Step 3: Commit**

```bash
git add packages/admin/cms-admin/src/form/file/chooseFile/ChooseFilesDialog.tsx
git commit -m "cms-admin: add ChooseFilesDialog for multi-file selection"
```

---

## Task 4: Create `FileFieldRow` styled primitives

**Files:**

- Create: `packages/admin/cms-admin/src/form/file/FileFieldRow.sc.ts`

- [ ] **Step 1: Write the styled components**

Create `packages/admin/cms-admin/src/form/file/FileFieldRow.sc.ts`:

```ts
import { styled } from "@mui/material/styles";

interface RootStyleProps {
    isMouseHover: boolean;
}

export const Root = styled("div", { shouldForwardProp: (prop) => prop !== "isMouseHover" })<RootStyleProps>`
    position: relative;
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    will-change: transform;

    &:last-of-type {
        border-bottom: none;
    }

    ${({ theme, isMouseHover }) => isMouseHover && `background-color: ${theme.palette.grey[50]};`}
`;

export const Grabber = styled("div")`
    position: relative;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    cursor: move;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: ${({ theme }) => theme.palette.primary.light};
        color: white;
    }
`;

export const InnerRow = styled("div")`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding: 12px 16px;
    gap: 16px;
    min-width: 0;
`;

export const PreviewSlot = styled("div")`
    flex-shrink: 0;
`;

export const TextSlot = styled("div")`
    flex-grow: 1;
    min-width: 0;
`;

export const ActionsSlot = styled("div")`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
`;
```

- [ ] **Step 2: Commit**

```bash
git add packages/admin/cms-admin/src/form/file/FileFieldRow.sc.ts
git commit -m "cms-admin: add styled primitives for FileFieldRow"
```

---

## Task 5: Build `FileFieldRow` component (with unit test)

**Files:**

- Create: `packages/admin/cms-admin/src/form/file/FileFieldRow.tsx`
- Create: `packages/admin/cms-admin/src/form/file/__tests__/FileFieldRow.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `packages/admin/cms-admin/src/form/file/__tests__/FileFieldRow.test.tsx`:

```tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, screen, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IntlProvider } from "react-intl";
import { describe, expect, it, vi } from "vitest";

import { FileFieldRow } from "../FileFieldRow";

vi.mock("../DamPathLazy", () => ({ DamPathLazy: () => <span data-testid="dam-path" /> }));
vi.mock("../../../dependencies/dependenciesConfig", () => ({ useDependenciesConfig: () => ({ entityDependencyMap: {} }) }));
vi.mock("../../../contentScope/Provider", () => ({ useContentScope: () => ({ match: { url: "" } }) }));

const theme = createTheme();

const renderRow = (overrides = {}) => {
    const props = {
        file: { id: "1", name: "test.png" } as any,
        index: 0,
        onRemove: vi.fn(),
        onMove: vi.fn(),
        menuActions: undefined,
        preview: undefined,
        ...overrides,
    };
    render(
        <IntlProvider locale="en">
            <ThemeProvider theme={theme}>
                <DndProvider backend={HTML5Backend}>
                    <FileFieldRow {...props} />
                </DndProvider>
            </ThemeProvider>
        </IntlProvider>,
    );
    return props;
};

describe("FileFieldRow", () => {
    it("renders file name", () => {
        renderRow({ file: { id: "1", name: "invoice.pdf" } });
        expect(screen.getByText("invoice.pdf")).toBeDefined();
    });

    it("calls onRemove when the remove menu item is clicked", () => {
        const props = renderRow();
        fireEvent.click(screen.getByRole("button", { name: /more/i }));
        fireEvent.click(screen.getByRole("menuitem", { name: /remove/i }));
        expect(props.onRemove).toHaveBeenCalledOnce();
    });

    it("renders preview via render function", () => {
        renderRow({ preview: (f: { id: string }) => <span data-testid="preview">{f.id}</span> });
        expect(screen.getByTestId("preview").textContent).toBe("1");
    });
});
```

- [ ] **Step 2: Run the test to confirm failure**

Run: `pnpm --filter @comet/cms-admin run test -- FileFieldRow`
Expected: FAIL — cannot import `../FileFieldRow` (module not yet created).

- [ ] **Step 3: Implement `FileFieldRow`**

Create `packages/admin/cms-admin/src/form/file/FileFieldRow.tsx`:

```tsx
import { useApolloClient } from "@apollo/client";
import { Delete, Drag, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { type ComponentProps, isValidElement, type MouseEventHandler, type ReactElement, type ReactNode, useRef, useState } from "react";
import { type DropTargetMonitor, useDrag, useDrop, type XYCoord } from "react-dnd";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { DamPathLazy } from "./DamPathLazy";
import * as sc from "./FileFieldRow.sc";
import type { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

const ITEM_TYPE = "fileFieldFile";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

interface DragItem {
    id: string;
    index: number;
}

interface FileFieldRowProps {
    file: GQLDamFileFieldFileFragment;
    index: number;
    onRemove: () => void;
    onMove: (dragIndex: number, hoverIndex: number) => void;
    preview?: (file: GQLDamFileFieldFileFragment) => ReactNode;
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
}

export const FileFieldRow = ({ file, index, onRemove, onMove, preview, menuActions }: FileFieldRowProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();

    const [, drop] = useDrop<DragItem>({
        accept: ITEM_TYPE,
        hover(item, monitor: DropTargetMonitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            onMove(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { id: file.id, index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(drop(ref));

    const handleMoreClick: MouseEventHandler<HTMLElement> = (event) => setMenuAnchorEl(event.currentTarget);
    const handleMenuClose = () => setMenuAnchorEl(null);
    const handleRemove = () => {
        onRemove();
        handleMenuClose();
    };

    const hasDamDependency = Boolean(entityDependencyMap["DamFile"]);

    return (
        <sc.Root
            ref={ref}
            style={{ opacity: isDragging ? 0 : 1 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            isMouseHover={hover}
        >
            <sc.Grabber>
                <Drag color="inherit" />
            </sc.Grabber>
            <sc.InnerRow>
                {preview && <sc.PreviewSlot>{preview(file)}</sc.PreviewSlot>}
                <sc.TextSlot>
                    <Typography variant="subtitle1" noWrap>
                        {file.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                        <DamPathLazy fileId={file.id} />
                    </Typography>
                </sc.TextSlot>
                <sc.ActionsSlot>
                    <IconButton size="small" onClick={handleMoreClick} aria-label="more">
                        <MoreVertical color="action" />
                    </IconButton>
                </sc.ActionsSlot>
            </sc.InnerRow>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                {hasDamDependency && (
                    <MenuItem
                        onClick={async () => {
                            handleMenuClose();
                            const path = await entityDependencyMap["DamFile"].resolvePath({ apolloClient, id: file.id });
                            window.open(contentScope.match.url + path, "_blank");
                        }}
                    >
                        <ListItemIcon>
                            <OpenNewTab />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="comet.form.file.openInDam" defaultMessage="Open in DAM" />} />
                    </MenuItem>
                )}
                {menuActions?.map((item, itemIndex) => {
                    if (!item) return null;
                    if (isValidElement(item)) return item;
                    const { label, icon, ...rest } = item as ActionItem;
                    return (
                        <MenuItem key={itemIndex} {...rest}>
                            {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                            <ListItemText primary={label} />
                        </MenuItem>
                    );
                })}
                <MenuItem onClick={handleRemove}>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary={<FormattedMessage id="comet.form.file.removeFile" defaultMessage="Remove" />} />
                </MenuItem>
            </Menu>
        </sc.Root>
    );
};
```

- [ ] **Step 4: Run test to verify pass**

Run: `pnpm --filter @comet/cms-admin run test -- FileFieldRow`
Expected: PASS — all three tests green.

- [ ] **Step 5: Lint fix and commit**

```bash
pnpm --filter @comet/cms-admin run lint:fix
git add packages/admin/cms-admin/src/form/file/FileFieldRow.tsx packages/admin/cms-admin/src/form/file/__tests__/FileFieldRow.test.tsx
git commit -m "cms-admin: add FileFieldRow for stacked multi-file rendering"
```

---

## Task 6: Add overloaded signature + multi-mode to `FileField`

**Files:**

- Modify: `packages/admin/cms-admin/src/form/file/FileField.tsx`
- Create: `packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx`

- [ ] **Step 1: Write the failing test (single mode regression + multi mode basics)**

Create `packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx`:

```tsx
import { MockedProvider } from "@apollo/client/testing";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IntlProvider } from "react-intl";
import { describe, expect, it, vi } from "vitest";

import { FileField } from "../FileField";

vi.mock("../chooseFile/ChooseFileDialog", () => ({
    ChooseFileDialog: ({ open }: { open: boolean }) => (open ? <div data-testid="choose-file-dialog" /> : null),
}));
vi.mock("../chooseFile/ChooseFilesDialog", () => ({
    ChooseFilesDialog: ({ open }: { open: boolean }) => (open ? <div data-testid="choose-files-dialog" /> : null),
}));
vi.mock("../DamPathLazy", () => ({ DamPathLazy: () => <span data-testid="dam-path" /> }));
vi.mock("../../../dependencies/dependenciesConfig", () => ({ useDependenciesConfig: () => ({ entityDependencyMap: {} }) }));
vi.mock("../../../contentScope/Provider", () => ({ useContentScope: () => ({ match: { url: "" } }) }));

const theme = createTheme();

const Wrap = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider>
        <IntlProvider locale="en">
            <ThemeProvider theme={theme}>
                <DndProvider backend={HTML5Backend}>{children}</DndProvider>
            </ThemeProvider>
        </IntlProvider>
    </MockedProvider>
);

const makeInput = <T,>(value: T | undefined, onChange = vi.fn()) => ({
    input: { value: value as T, onChange, name: "file", onBlur: vi.fn(), onFocus: vi.fn() },
    meta: {} as any,
});

describe("FileField single mode (backwards compatible)", () => {
    it("renders the choose-file button when value is undefined", () => {
        render(
            <Wrap>
                <FileField {...(makeInput(undefined) as any)} />
            </Wrap>,
        );
        expect(screen.getByRole("button", { name: /choose file/i })).toBeDefined();
    });

    it("renders the file name when value is a single fragment", () => {
        render(
            <Wrap>
                <FileField {...(makeInput({ id: "1", name: "single.png" }) as any)} />
            </Wrap>,
        );
        expect(screen.getByText("single.png")).toBeDefined();
    });

    it("clears the value when Empty is clicked", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField {...(makeInput({ id: "1", name: "single.png" }, onChange) as any)} />
            </Wrap>,
        );
        fireEvent.click(screen.getByRole("button", { name: /empty/i }));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });
});

describe("FileField multi mode", () => {
    it("renders the choose-files button when value is undefined", () => {
        render(
            <Wrap>
                <FileField multiple {...(makeInput<any[]>(undefined) as any)} />
            </Wrap>,
        );
        expect(screen.getByRole("button", { name: /choose files/i })).toBeDefined();
    });

    it("renders a row per file and a Change-selected-files button when value has files", () => {
        render(
            <Wrap>
                <FileField
                    multiple
                    {...(makeInput([
                        { id: "1", name: "a.png" },
                        { id: "2", name: "b.png" },
                    ]) as any)}
                />
            </Wrap>,
        );
        expect(screen.getByText("a.png")).toBeDefined();
        expect(screen.getByText("b.png")).toBeDefined();
        expect(screen.getByRole("button", { name: /change selected files/i })).toBeDefined();
    });

    it("removes a file and keeps the rest", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField
                    multiple
                    {...(makeInput(
                        [
                            { id: "1", name: "a.png" },
                            { id: "2", name: "b.png" },
                        ],
                        onChange,
                    ) as any)}
                />
            </Wrap>,
        );
        const moreButtons = screen.getAllByRole("button", { name: /more/i });
        fireEvent.click(moreButtons[0]);
        fireEvent.click(screen.getByRole("menuitem", { name: /remove/i }));
        expect(onChange).toHaveBeenCalledWith([{ id: "2", name: "b.png" }]);
    });

    it("removing the last file yields undefined", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField multiple {...(makeInput([{ id: "1", name: "a.png" }], onChange) as any)} />
            </Wrap>,
        );
        fireEvent.click(screen.getByRole("button", { name: /more/i }));
        fireEvent.click(screen.getByRole("menuitem", { name: /remove/i }));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm --filter @comet/cms-admin run test -- FileField`
Expected: FAIL — multi-mode behavior is not yet implemented; current `FileField` can't accept `multiple` prop and does not render an array.

- [ ] **Step 3: Rewrite `FileField.tsx` with overloads and multi-mode branch**

Replace the entire contents of `packages/admin/cms-admin/src/form/file/FileField.tsx` with:

```tsx
import { useApolloClient } from "@apollo/client";
import { Assets, Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { Box, Divider, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { type ComponentProps, isValidElement, type ReactElement, type ReactNode, useState } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "../../blocks/common/BlockAdminComponentPaper";
import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import { ChooseFileDialog } from "./chooseFile/ChooseFileDialog";
import { ChooseFilesDialog } from "./chooseFile/ChooseFilesDialog";
import { DamPathLazy } from "./DamPathLazy";
import { damFileFieldFileQuery } from "./FileField.gql";
import type { GQLDamFileFieldFileFragment, GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables } from "./FileField.gql.generated";
import { FileFieldRow } from "./FileFieldRow";

export type { GQLDamFileFieldFileFragment } from "./FileField.gql.generated";

interface ActionItem extends ComponentProps<typeof MenuItem> {
    label: ReactNode;
    icon?: ReactNode;
}

type CommonProps = {
    buttonText?: ReactNode;
    allowedMimetypes?: string[];
    menuActions?: Array<ActionItem | ReactElement | null | undefined>;
};

type SingleFileFieldProps = FieldRenderProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> &
    CommonProps & {
        multiple?: false;
        preview?: ReactNode;
    };

type MultiFileFieldProps = FieldRenderProps<GQLDamFileFieldFileFragment[] | undefined, HTMLInputElement> &
    CommonProps & {
        multiple: true;
        preview?: (file: GQLDamFileFieldFileFragment) => ReactNode;
    };

export function FileField(props: SingleFileFieldProps): ReactElement;
export function FileField(props: MultiFileFieldProps): ReactElement;
export function FileField(props: SingleFileFieldProps | MultiFileFieldProps): ReactElement {
    if (props.multiple) {
        return <MultiFileField {...props} />;
    }
    return <SingleFileField {...props} />;
}

const SingleFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: SingleFileFieldProps) => {
    const [chooseFileDialogOpen, setChooseFileDialogOpen] = useState<boolean>(false);
    const client = useApolloClient();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();

    const handleMenuClose = () => setAnchorEl(null);

    const damFile = input.value;

    if (damFile) {
        const showMenu = Boolean(entityDependencyMap["DamFile"]) || (menuActions !== undefined && menuActions.length > 0);
        return (
            <>
                <BlockAdminComponentPaper disablePadding>
                    <Box padding={3}>
                        <Grid container alignItems="center" spacing={3}>
                            {preview && <Grid>{preview}</Grid>}
                            <Grid size="grow">
                                <Typography variant="subtitle1">{damFile.name}</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <DamPathLazy fileId={damFile.id} />
                                </Typography>
                            </Grid>
                            {showMenu && (
                                <Grid>
                                    <IconButton
                                        onMouseDown={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setAnchorEl(event.currentTarget);
                                        }}
                                        size="large"
                                    >
                                        <MoreVertical />
                                    </IconButton>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    <Divider />
                    <BlockAdminComponentButton startIcon={<Delete />} onClick={() => input.onChange(undefined)}>
                        <FormattedMessage id="comet.form.file.empty" defaultMessage="Empty" />
                    </BlockAdminComponentButton>
                </BlockAdminComponentPaper>
                {showMenu && (
                    <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {entityDependencyMap["DamFile"] && (
                            <MenuItem
                                onClick={async () => {
                                    const path = await entityDependencyMap["DamFile"].resolvePath({
                                        apolloClient,
                                        id: damFile.id,
                                    });
                                    const url = contentScope.match.url + path;
                                    window.open(url, "_blank");
                                }}
                            >
                                <ListItemIcon>
                                    <OpenNewTab />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="comet.form.file.openInDam" defaultMessage="Open in DAM" />} />
                            </MenuItem>
                        )}
                        {menuActions &&
                            menuActions.map((item, index) => {
                                if (!item) return null;
                                if (isValidElement(item)) return item;
                                const { label, icon, ...rest } = item as ActionItem;
                                return (
                                    <MenuItem key={index} {...rest}>
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                    </MenuItem>
                                );
                            })}
                    </Menu>
                )}
            </>
        );
    }

    return (
        <>
            <BlockAdminComponentButton onClick={() => setChooseFileDialogOpen(true)} startIcon={<Assets />} size="large">
                {buttonText ?? <FormattedMessage id="comet.form.file.chooseFile" defaultMessage="Choose file" />}
            </BlockAdminComponentButton>
            <ChooseFileDialog
                open={chooseFileDialogOpen}
                allowedMimetypes={allowedMimetypes}
                onClose={() => setChooseFileDialogOpen(false)}
                onChooseFile={async (fileId) => {
                    setChooseFileDialogOpen(false);
                    const { data } = await client.query<GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables>({
                        query: damFileFieldFileQuery,
                        variables: { id: fileId },
                    });
                    input.onChange(data.damFile);
                }}
            />
        </>
    );
};

const MultiFileField = ({ buttonText, input, allowedMimetypes, preview, menuActions }: MultiFileFieldProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const client = useApolloClient();

    const files: GQLDamFileFieldFileFragment[] = input.value ?? [];

    const commitChange = (next: GQLDamFileFieldFileFragment[]) => {
        input.onChange(next.length === 0 ? undefined : next);
    };

    const handleRemove = (id: string) => {
        commitChange(files.filter((f) => f.id !== id));
    };

    const handleMove = (dragIndex: number, hoverIndex: number) => {
        const next = [...files];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(hoverIndex, 0, moved);
        commitChange(next);
    };

    const handleConfirm = async (fileIds: string[]) => {
        setDialogOpen(false);

        const existingById = new Map(files.map((f) => [f.id, f] as const));
        const next: GQLDamFileFieldFileFragment[] = await Promise.all(
            fileIds.map(async (id) => {
                const existing = existingById.get(id);
                if (existing) return existing;
                const { data } = await client.query<GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables>({
                    query: damFileFieldFileQuery,
                    variables: { id },
                });
                return data.damFile as GQLDamFileFieldFileFragment;
            }),
        );

        commitChange(next);
    };

    if (files.length === 0) {
        return (
            <>
                <BlockAdminComponentButton onClick={() => setDialogOpen(true)} startIcon={<Assets />} size="large">
                    {buttonText ?? <FormattedMessage id="comet.form.file.chooseFiles" defaultMessage="Choose files" />}
                </BlockAdminComponentButton>
                <ChooseFilesDialog
                    open={dialogOpen}
                    allowedMimetypes={allowedMimetypes}
                    initialFileIds={[]}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleConfirm}
                />
            </>
        );
    }

    return (
        <>
            <BlockAdminComponentPaper disablePadding>
                {files.map((file, index) => (
                    <FileFieldRow
                        key={file.id}
                        file={file}
                        index={index}
                        onRemove={() => handleRemove(file.id)}
                        onMove={handleMove}
                        preview={preview}
                        menuActions={menuActions}
                    />
                ))}
                <Divider />
                <BlockAdminComponentButton startIcon={<Assets />} onClick={() => setDialogOpen(true)}>
                    <FormattedMessage id="comet.form.file.changeSelectedFiles" defaultMessage="Change selected files" />
                </BlockAdminComponentButton>
            </BlockAdminComponentPaper>
            <ChooseFilesDialog
                open={dialogOpen}
                allowedMimetypes={allowedMimetypes}
                initialFileIds={files.map((f) => f.id)}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
};
```

- [ ] **Step 4: Run tests to verify pass**

Run: `pnpm --filter @comet/cms-admin run test -- FileField`
Expected: PASS — all single-mode and multi-mode tests green.

- [ ] **Step 5: Build**

Run: `pnpm --filter @comet/cms-admin run build`
Expected: Clean build (types for the overload resolve cleanly).

- [ ] **Step 6: Lint fix and commit**

```bash
pnpm --filter @comet/cms-admin run lint:fix
git add packages/admin/cms-admin/src/form/file/FileField.tsx packages/admin/cms-admin/src/form/file/__tests__/FileField.test.tsx
git commit -m "cms-admin: add multiple prop to FileField"
```

---

## Task 7: Add changeset

**Files:**

- Create: `.changeset/filefield-multi-select.md`

- [ ] **Step 1: Write the changeset**

Create `.changeset/filefield-multi-select.md`:

```md
---
"@comet/cms-admin": minor
---

Add `multiple` prop to `FileField` for selecting multiple DAM files

`FileField` now accepts `multiple={true}` to select a list of DAM files instead of a single file. Multi-file values are `GQLDamFileFieldFileFragment[]`; the component renders a stacked, reorderable list of files with per-row menu and remove actions. The picker dialog pre-checks the current selection and replaces the value on confirm. The existing single-file API is unchanged.

**Example**

`‌``tsx
<Field name="files" component={FileField} multiple preview={(file) => <Thumbnail fileId={file.id} />} />
`‌``
```

Replace the zero-width joiners (`‌`) with nothing when authoring — the three-backtick fence should be literal ` ``` `. (The zero-width joiners are used here only to display nested fences inside this plan file.)

- [ ] **Step 2: Verify cspell**

Run: `pnpm cspell .changeset/filefield-multi-select.md`
Expected: No unknown words; if any appear (e.g. product names), add them to `.cspellignore` at the repo root.

- [ ] **Step 3: Commit**

```bash
git add .changeset/filefield-multi-select.md
git commit -m "Add FileField multi-select changeset"
```

---

## Task 8: Verify the full workspace builds and tests pass

- [ ] **Step 1: Run full cms-admin tests**

Run: `pnpm --filter @comet/cms-admin run test`
Expected: All tests pass; both new `FileField.test.tsx` and `FileFieldRow.test.tsx` files are included.

- [ ] **Step 2: Run full cms-admin build**

Run: `pnpm --filter @comet/cms-admin run build`
Expected: Clean compile with no TypeScript errors.

- [ ] **Step 3: Run lint across cms-admin**

Run: `pnpm --filter @comet/cms-admin run lint`
Expected: No errors. If ESLint surfaces any warnings, fix them and commit before proceeding.

- [ ] **Step 4: Manual smoke (optional but recommended)**

If dev-pm is running the demo app locally, add `multiple` to any demo `FileField` usage (or temporarily patch one block) and verify:

- Empty state shows "Choose files" button.
- Dialog opens, checkboxes visible on file rows, folder checkboxes disabled.
- "Select all" header checkbox selects all files on the current page.
- Apply → files appear stacked in the field.
- Drag-reorder reorders rows.
- Row menu → Remove → removes just that row.
- "Change selected files" re-opens dialog pre-checked.

Revert the demo patch before committing. No commit required for this step.

---

## Self-review checklist (done by the author of this plan)

- Spec sections → tasks mapping:
    - §Public API → Task 6 (overloaded signature).
    - §Single mode render → Task 6 (preserved intact via `SingleFileField`).
    - §Multi mode render → Tasks 4, 5, 6.
    - §`FileFieldRow` → Tasks 4 (styles), 5 (component + tests).
    - §Dialog (`ChooseFilesDialog`) → Task 3.
    - §`DamTable`/`FolderDataGrid` changes → Tasks 1, 2.
    - §Reordering (react-dnd) → Task 5 (dnd inside `FileFieldRow`).
    - §Testing → Tasks 5, 6 (unit tests for row + field; single-mode regression tests included).
    - §Changeset → Task 7.
- Placeholder scan — no "TBD"/"TODO"/"implement later" present. Every code step has full code.
- Type consistency — `DamItemSelectionMap` imported consistently from `FolderDataGrid`; `GQLDamFileFieldFileFragment` used throughout; `onMove(dragIndex, hoverIndex)` signature identical in row and field.
- Risk notes — `SaveButton` fallback mentioned in Task 3; `DndProvider` assumed present in consuming app (demo-admin has it at the root; if a caller tree lacks one, follow-up is to add a local provider).
