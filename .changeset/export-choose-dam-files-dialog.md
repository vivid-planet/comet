---
"@comet/cms-admin": minor
---

Export `ChooseDamFilesDialog`

Allows building custom multi-file picker UIs on top of the DAM file dialog (e.g. bulk-adding files to a list block).

```tsx
import { ChooseDamFilesDialog } from "@comet/cms-admin";

<ChooseDamFilesDialog open={open} onClose={onClose} onConfirm={(fileIds) => ...} initialFileIds={[]} allowedMimetypes={["image/jpeg"]} />
```
