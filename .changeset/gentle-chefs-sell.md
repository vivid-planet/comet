---
"@comet/admin": major
---

Remove `requiredSymbol` Prop from `FieldContainer` component and use native implementation

This prop was used to display a custom required symbol next to the label of the field. We now use the native implementation of the required attribute of MUI to ensure better accessibility and compatibility with screen readers. 
