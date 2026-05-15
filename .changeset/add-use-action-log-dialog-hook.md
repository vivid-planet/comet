---
"@comet/cms-admin": minor
---

Add `useActionLogDialog` hook

A new hook that owns the dialog's open state, view state (grid / show version / compare versions), and Apollo queries built from the library's fragments. It returns a configured `ActionLogDialog` component (ready to render without props) and an `{ openActionLogDialog, closeActionLogDialog }` API — mirroring the `useEditDialog` pattern.

**Usage**

Pass your app's `GQLQuery` as the hook's generic argument. `rootField` is then constrained to the GraphQL root fields that expose `actionLog`/`actionLogs` (i.e. entities decorated with `@ActionLogs()`), so typos are caught at compile time.

```tsx
import { useActionLogDialog } from "@comet/cms-admin";
import type { GQLQuery } from "@src/graphql.generated";

function EditToolbar({ id }: { id: string }) {
    const [ActionLogDialog, { openActionLogDialog }] = useActionLogDialog<GQLQuery>({
        rootField: "manufacturer",
        id,
    });

    return (
        <>
            <Button onClick={openActionLogDialog}>Version history</Button>
            <ActionLogDialog />
        </>
    );
}
```

Without the `GQLQuery` generic, `rootField` falls back to `string` so call sites without codegen still work.
