---
"@comet/admin-generator": minor
---

Add support for `fieldLabel` and `checkboxLabel` properties in boolean field type configuration

Boolean fields now properly support `fieldLabel` (for the left-aligned label in horizontal layouts) and an optional `checkboxLabel` (for the checkbox label). Both properties support `string` and `FormattedMessageElement` types for i18n.

Previously, the `label` property was passed directly to `CheckboxField.label`, making boolean fields inconsistent with other field types. Now:

- `label` is passed as `fieldLabel` to align with other form fields
- `checkboxLabel` (optional) is passed as `label` for the checkbox itself

Example:

```typescript
{
  type: "boolean",
  name: "hasParticipated",
  label: "Has Participated",      // Becomes fieldLabel (left-aligned)
  checkboxLabel: "Yes/No",         // Optional, becomes checkbox label
}
```
