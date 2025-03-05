---
"@comet/admin": major
---

Adapt `SaveButton`, `FinalFormSaveButton` and `SaveBoundarySaveButton` to look like the standard `FeedbackButton` and match the Comet DXP design

The props of `SaveButton` and `SaveBoundarySaveButton` have been updated to match the props of `FeedbackButton`

- `saving` is now `loading`
- `hasConflict` can be replaced with `hasError`
- `saveIcon` is now `startIcon`
- `savingItem` removed
- `successItem` removed
- `errorItem` removed
- `conflictItem` removed
- `savingIcon` removed
- `successIcon` removed
- `errorIcon` removed
- `conflictIcon` removed

```ts
// export interface SaveButtonProps extends ThemedComponentBaseProps<{ root: typeof FeedbackButton }>, Omit<FeedbackButtonProps, "slotProps"> {
//     // saving?: boolean; // Changed to `loading` in `FeedbackButton`
//     // hasErrors?: boolean; // Exists from `FeedbackButton`
//     // hasConflict?: boolean; // Should this be replaced by `hasError`?
//     // savingItem?: ReactNode; // No longer exists in `FeedbackButton`
//     // successItem?: ReactNode; // No longer exists in `FeedbackButton`
//     // errorItem?: ReactNode; // No longer exists in `FeedbackButton`
//     // conflictItem?: ReactNode; // No longer exists in `FeedbackButton`
//     // saveIcon?: ReactNode; // Changed to `startIcon` in `FeedbackButton`
//     // savingIcon?: ReactNode;  // No longer exists in `FeedbackButton`
//     // successIcon?: ReactNode; // No longer exists in `FeedbackButton`
//     // errorIcon?: ReactNode; // No longer exists in `FeedbackButton`
//     // conflictIcon?: ReactNode; // No longer exists in `FeedbackButton`
// }
```
