---
"@comet/cms-admin": minor
---

Add `GlobalSearch` component for full-text search

The `GlobalSearch` component renders a search input (intended for the header) that opens a dropdown with the results of the `fullTextSearch` query. The search is restricted to the currently selected content scope. Clicking a result opens the corresponding entity using the `entityDependencyMap` from the `DependenciesConfig` (the same mechanism used by warnings and dependencies).

**Example**

```tsx
import { GlobalSearch, Header } from "@comet/cms-admin";

<Header>
    <ContentScopeControls />
    <GlobalSearch />
    <UserHeaderItem />
</Header>;
```
