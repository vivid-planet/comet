---
"@comet/admin": minor
---

Add optional `hasConflict` prop to `SaveButton`, `FinalFormSaveButton` and `FinalFormSaveSplitButton`

If set to `true`, a new "conflict" display state is triggered.
You should pass the `hasConflict` prop returned by `useSaveConflict()`, `useSaveConflictQuery()` and `useFormSaveConflict()`.
