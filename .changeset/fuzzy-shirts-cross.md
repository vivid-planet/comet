---
"@comet/site-react": minor
---

Add HTML anchor props pass-through to `DamFileDownloadLinkBlock`

These link block component now accept and pass through standard HTML anchor element attributes (such as `id`, `className`, `style`, `target`, `rel`, `aria-*`, `data-*`, `onClick`, etc.) to the rendered `<a>` element.

**Example**:

```tsx
<DamFileDownloadLinkBlock data={linkData} className="custom-link">
    <span>Download file</span>
</DamFileDownloadLinkBlock>
```
