---
"@comet/cms-admin": minor
---

Export `ChooseFilesDialog`

Allows building custom multi-file picker UIs on top of the DAM file dialog (e.g. bulk-adding files to a list block). Pair with `damMultiFileFieldFragment` and a Dam file query to fetch the picked file metadata.

```tsx
import { ChooseFilesDialog } from "@comet/cms-admin";

<ChooseFilesDialog open={open} onClose={onClose} onConfirm={(fileIds) => ...} initialFileIds={[]} allowedMimetypes={["image/jpeg"]} />
```
