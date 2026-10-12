---
"@dextinity/admin-rte": patch
---

Stop passing the control props of the RTE toolbar to DOM elements

`Toolbar`, `LinkControls` and `BlockTypesControls` passed `editorState`, `setEditorState`, `editorRef` and `options` on to their root element. React logged "React does not recognize the `editorRef` prop on a DOM element", and the props were rendered as `editorstate="[object Object]"` attributes.
