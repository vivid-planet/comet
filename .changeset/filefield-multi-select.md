---
"@comet/cms-admin": minor
---

Add `multiple` prop to `FileField` for selecting multiple DAM files

`FileField` now accepts `multiple={true}` to select a list of DAM files instead of a single file. Multi-file values are `GQLDamFileFieldFileFragment[]`; the component renders a stacked, reorderable list of files with per-row menu and remove actions. The picker dialog pre-checks the current selection and replaces the value on confirm. The existing single-file API is unchanged.

**Example**

```tsx
<Field name="files" component={FileField} multiple preview={(file) => <Thumbnail fileId={file.id} />} />
```
