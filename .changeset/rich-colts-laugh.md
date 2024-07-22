---
"@comet/cms-site": major
---

An ErrorBoundary was put around each block in the BlocksBlock, OneOfBlock and ListBlock to prevent the whole page from crashing in SSR applications.
Instead of the broken block, the broken block is hidden in the production build. In local development, the block still throws an error
Since a broken block is invisible on built applications, the application should take care of handling this case. The BlocksBlock, OneOfBlock and ListBlock therefore now has an optional property for reporting an Error.

**BlocksBlock with onError function:**

```tsx
<BlocksBlock
    {/* ... */}
    onError={(error) => {
        // Application should handle error reporting
    }}>
    {/* ... */}
</MenuItemGroup>
```
