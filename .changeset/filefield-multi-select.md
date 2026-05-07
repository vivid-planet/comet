---
"@comet/cms-admin": minor
---

Add `multiple` prop to `FileField` for selecting multiple DAM files

`FileField` now accepts `multiple={true}` to select a list of DAM files instead of a single file. Multi-file values are typed as `GQLDamFileFieldFileFragment[]` (the same fragment used in single-file mode); the component renders a stacked list of files with per-row menu and remove actions. The picker dialog pre-checks the current selection via `initialFileIds` and returns the picked file ids on confirm. The single-file API is unchanged.

**Example**

```tsx
<Field name="files" component={FileField} multiple preview={(file) => <Thumbnail fileId={file.id} />} />
```
