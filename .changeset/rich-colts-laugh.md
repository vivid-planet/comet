---
"@comet/cms-site": major
---

An ErrorBoundary was put around each block in the BlocksBlock, to prevent the whole page from crashing in SSR applications.
Instead of the broken block, a red error div box is displayed locally. The broken block is hidden in the production build. 
Since a broken block is invisible on built applications, the application should take care of handling this case. The BlocksBlock therefore now has a required property for reporting an Error. 

**BlocksBlock with reportError function:**
```tsx
<BlocksBlock
    {/* ... */}
    reportError={(error) => {
        // Application should handle error reporting
    }}>
    {/* ... */}
</MenuItemGroup>
```