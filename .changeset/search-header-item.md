---
"@comet/cms-admin": minor
---

Add `SearchHeaderItem` component for full-text search

The `SearchHeaderItem` component renders a search input (intended for the header) that opens a dropdown with the results of the `myFullTextSearch` query. The search is restricted to the currently selected content scope. Clicking a result opens the corresponding entity using the `entityDependencyMap` from the `DependenciesConfig` (the same mechanism used by warnings and dependencies).

**Example**

```tsx
import { Header, SearchHeaderItem } from "@comet/cms-admin";

<Header>
    <SearchHeaderItem />
    <ContentScopeControls />
    <UserHeaderItem />
</Header>;
```
