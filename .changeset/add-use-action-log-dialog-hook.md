---
"@comet/cms-admin": minor
---

Add `useActionLogDialog` hook

A new hook that owns the dialog's open state, view state (grid / show version / compare versions), and Apollo queries built from the library's fragments. It returns a configured `ActionLogDialog` component (ready to render without props) and an `{ openActionLogDialog, closeActionLogDialog }` API — mirroring the `useEditDialog` pattern.

**Example**

```tsx
import { useActionLogDialog } from "@comet/cms-admin";

function EditToolbar({ id }: { id: string }) {
    const [ActionLogDialog, { openActionLogDialog }] = useActionLogDialog({ rootField: "manufacturer", id });

    return (
        <>
            <Button onClick={openActionLogDialog}>Version history</Button>
            <ActionLogDialog />
        </>
    );
}
```

`rootField` is the GraphQL field on `Query` that exposes `actionLog(id)` / `actionLogs(...)` for the entity (e.g. `"manufacturer"`, `"product"`, `"news"`).
