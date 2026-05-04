---
"@comet/cms-admin": minor
---

Export `ChooseDamFilesDialog`

Allows building custom multi-file picker UIs on top of the DAM file dialog (e.g. bulk-adding files to a list block). Pair it with `damMultiFileFieldFragment` and a DAM file query to fetch the picked file metadata.

```tsx
import { ChooseDamFilesDialog } from "@comet/cms-admin";

<ChooseDamFilesDialog open={open} onClose={onClose} onConfirm={(fileIds) => ...} initialFileIds={[]} allowedMimetypes={["image/jpeg"]} />
```
