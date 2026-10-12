---
"@dextinity/cms-admin": patch
---

Remove the unsupported `rowsMax` prop from the description fields of `createSeoBlock`

MUI v5 removed `rowsMax`, so the prop had no effect and only caused the React warning "React does not recognize the `rowsMax` prop on a DOM element". The fields keep their height of three rows.
