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
            supportsBlock={(name, scope) => {
                if (scope.domain === "specific-customer") {
                    return true;
                } else {
                    // Note: this is the block name defined in the BlockInterface
                    return name !== "MySpecialTeaser";
                }
            }}
        >
            {/* Other providers... */}
        </BlocksConfigProvider>
    );
}
```

**Note: This feature is Admin-only, so creating documents with unsupported blocks is still possible in the API.**
