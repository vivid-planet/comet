---
"@comet/cms-admin": minor
---

Add support for scope-specific blocks

Use the newly added `BlocksConfigProvider` to specify if a block is allowed in the current content scope:

```tsx title="App.tsx"
import { BlocksConfigProvider } from "@comet/cms-admin";

export function App() {
    return (
        <BlocksConfigProvider
            isBlockSupported={(block, scope) => {
                if (scope.domain === "specific-customer") {
                    return true;
                } else {
                    return block.name !== MySpecialTeaserBlock.name;
                }
            }}
        >
            {/* Other providers... */}
        </BlocksConfigProvider>
    );
}
```

**Note: This feature is Admin-only, so creating documents with unsupported blocks is still possible in the API.**
