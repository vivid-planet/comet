---
"@comet/site-react": patch
---

Add HTML anchor props pass-through to `ExternalLinkBlock`, `PhoneLinkBlock`, and `EmailLinkBlock`

These link block components now accept and pass through standard HTML anchor element attributes (such as `id`, `className`, `style`, `target`, `rel`, `aria-*`, `data-*`, `onClick`, etc.) to the rendered `<a>` element.

**Security enhancement**: `ExternalLinkBlock` now automatically includes `rel="noopener noreferrer"` for links with `target="_blank"`, merging with any existing `rel` attribute to prevent security vulnerabilities.

**Example**:

```tsx
<ExternalLinkBlock data={linkData} className="custom-link" aria-label="Opens external site" data-tracking="external-click">
    <span>External Link</span>
</ExternalLinkBlock>
```
