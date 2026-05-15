---
"@comet/cms-admin": minor
---

Add `useActionLogDialog` hook

The hook owns the dialog's open state, view state (grid / show version / compare versions), and Apollo queries built from the library's fragments. It returns `openActionLogDialog`, `closeActionLogDialog`, and a `dialogProps` object to spread into `ActionLogDialog`.

**Example**

```tsx
import { ActionLogDialog, useActionLogDialog } from "@comet/cms-admin";

function EditToolbar({ id }: { id: string }) {
    const { openActionLogDialog, dialogProps } = useActionLogDialog({ rootField: "manufacturer", id });

    return (
        <>
            <Button onClick={openActionLogDialog}>Version history</Button>
            <ActionLogDialog {...dialogProps} />
        </>
    );
}
```

`rootField` is the GraphQL field on `Query` that exposes `actionLog(id)` / `actionLogs(...)` for the entity (e.g. `"manufacturer"`, `"product"`, `"news"`).
