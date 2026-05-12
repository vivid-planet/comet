---
"@comet/cms-admin": major
---

Replace `DependencyList` with `DependenciesList` and `DependentsList`

**Breaking change:** `DependencyList` has been removed. Use `DependenciesList` for queries returning `item.dependencies` and `DependentsList` for queries returning `item.dependents`.
