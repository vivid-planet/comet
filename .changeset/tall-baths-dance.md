---
"@comet/admin": minor
---

**Toolbar:** add `topBarActions` prop to render custom actions in the top bar, and introduce `<HelpDialogButton />` for a built-in help dialog trigger.

### What’s new

- `Toolbar` now supports a new prop: `topBarActions` (class key & slot name: `"topBarActions"`). Use it to place action controls on the right side of the top bar.
- New component: `HelpDialogButton` (exported from `@comet/admin`). It renders an icon button that toggles a modal dialog with a title and rich help content.

### Usage

```tsx
import { Toolbar, HelpDialogButton } from "@comet/admin";
import { FormattedMessage } from "react-intl";

<Toolbar
    topBarActions={
        <HelpDialogButton
            dialogTitle={<FormattedMessage id="toolbar.help.title" defaultMessage="Help" />}
            dialogDescription={<Typography>Put any explanatory text, images, or markup here.</Typography>}
        />
    }
>
    {/* your toolbar items */}
</Toolbar>;
```
