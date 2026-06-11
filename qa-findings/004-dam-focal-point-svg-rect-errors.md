# DAM file detail: SVG `<rect>` attribute errors (`undefinedundefin…`) from the crop/focal-point overlay

- **Severity:** minor
- **Location:** Admin → Assets → (open any image) — e.g. `http://localhost:8000/main/en/assets/<fileId>/edit`
- **Affected code:** image crop UI in `packages/admin/cms-admin/src/common/image/ImageCrop.tsx` (wraps `react-image-crop`)

## Summary

Opening the detail/edit view of any image in the DAM logs four SVG attribute errors on every load:

```
Error: <rect> attribute x: Expected length, "undefinedundefin…".
Error: <rect> attribute y: Expected length, "undefinedundefin…".
Error: <rect> attribute width: Expected length, "undefinedundefin…".
Error: <rect> attribute height: Expected length, "undefinedundefin…".
```

The crop/focal-point overlay rect is rendered with `undefined` values (string-concatenated into `undefinedundefined…`), i.e. the rect is drawn before the crop/image dimensions are available. The page otherwise renders, but the selection rect is invalid at that moment and the errors fire reliably on every image, for both freshly uploaded files and fixture images.

## Steps to reproduce

1. Log in to the Demo Admin.
2. Navigate to **Assets** (`/main/en/assets`).
3. Open any image file (e.g. `comet.png`) by clicking its row.
4. Watch the browser console while the detail view loads ("Smart focus point" enabled by default).

## Expected vs. actual behavior

- **Expected:** The crop overlay only renders once it has valid numeric coordinates; no SVG attribute errors.
- **Actual:** Four `<rect>` attribute errors are logged on every image detail load.

## Evidence

- Screenshot: [screenshots/004-dam-file-detail.png](screenshots/004-dam-file-detail.png)
- Screencast: [screencasts/004-dam-focal-point-svg-rect-errors.webm](screencasts/004-dam-focal-point-svg-rect-errors.webm)
