---
"@comet/admin": minor
---

Add `Alert` component

**Example:**

```tsx
import { Alert, OkayButton, SaveButton } from "@comet/admin";

<Alert
    severity="warning"
    title="Title"
    action={
        <Button variant="text" startIcon={<ArrowRight />}>
            Action Text
        </Button>
    }
>
    Notification Text
</Alert>
```