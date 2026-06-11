# Page editor block preview: `<div>` inside `<p>` causes hydration errors (Heading block)

- **Severity:** minor
- **Location:** Admin → Page tree → edit "Home" (preview iframe at `http://localhost:3000/block-preview/main/en/page`); rendering originates in the site's block-preview output
- **Affected area:** block preview wrappers (`data-comet-block-preview-container` divs) rendered inside a `<p>` produced by the Heading/Typography output (demo site `StandaloneHeadingBlock` / `@comet/site-react` preview wrapping)

## Summary

When the page editor's preview iframe renders the "Home" page, the browser logs:

```
In HTML, <div> cannot be a descendant of <p>. This will cause a hydration error.
  ...
    <d adminRoute="/main/en/p..." label="Heading" enabledAutoScrolling={true}>
      <div ref={{current:null}} className="_previewEl..." data-comet-block-preview-container="">
        <div className="Standalone...">
          <d adminRoute="/main/en/p..." label="Heading" enabledAutoScrolling={true}>
            <div ref={{current:null}} className="_previewEl..." data-comet-block-preview-container="">
              ...

<p> cannot contain a nested <div>. See this log for the ancestor stack trace.
```

In preview mode every block is wrapped in a `<div data-comet-block-preview-container>`; when such a wrapper ends up inside an element rendered as `<p>` (here via the Heading block's typography), the resulting markup is invalid and React reports a guaranteed hydration error. The Next.js dev overlay on the preview shows "2 Issues" for the Home page.

The regular site rendering of the same page (`http://localhost:3000/en`) is clean — the problem is specific to the preview wrapping.

## Steps to reproduce

1. Start demo API, Admin and Site; log in to the Demo Admin.
2. Navigate to **Page tree → Main navigation** and open the **Home** page (edit content view).
3. Wait for the preview iframe to load; check the console (and the dev-overlay badge inside the preview pane).

## Expected vs. actual behavior

- **Expected:** Block preview wrappers use markup that is valid in their rendering context (or use a non-intrusive wrapper), so the preview renders without hydration errors.
- **Actual:** Invalid `<div>`-inside-`<p>` nesting and a hydration error are reported every time the Home page preview loads.

## Evidence

- Screenshot (editor with preview + "2 Issues" overlay): [screenshots/010-page-editor-preview.png](screenshots/010-page-editor-preview.png)
- Screencast: [screencasts/010-block-preview-hydration-error.webm](screencasts/010-block-preview-hydration-error.webm)
