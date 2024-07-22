---
"@comet/admin": major
---

Remove the `requiredSymbol` prop from `FieldContainer` and use MUIs native implementation

This prop was used to display a custom required symbol next to the label of the field. We now use the native implementation of the required attribute of MUI to ensure better accessibility and compatibility with screen readers.
