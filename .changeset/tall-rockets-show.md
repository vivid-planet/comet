---
"@comet/admin": major
---

Adapt `SaveButton` and `SaveBoundarySaveButton` to look like the standard `FeedbackButton` in order to match the Comet DXP design

Their props have been updated to match those of `FeedbackButton`:

- `saving` has been renamed to `loading`.
- `saveIcon` has been renamed to `startIcon`.
- `hasConflict` has been removed. Use `hasErrors` instead and optionally provide a `tooltipErrorMessage` to show a more precise error message in the tooltip.
- The following icon-props have been removed, as the `startIcon` is now shown in all states: `savingIcon`, `successIcon`, `errorIcon`, `conflictIcon`.
- The following props used for the text-content have been removed as now the default text is shown in all states: `savingItem`, `successItem`, `errorItem`, `conflictItem`.
