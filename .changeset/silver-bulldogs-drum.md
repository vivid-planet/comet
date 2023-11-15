---
"@comet/cms-api": major
---

Rename `BlockIndexService` to `DependenciesService` and move it from the `BlocksModule` to the new `DependenciesModule`.

Following changes were made to the `DependenciesService`:

- A stale-while-revalidate approach for refreshing the view was added to `refreshViews()`. If you need the view to be updated unconditionally, you must call the method with the new `force: true` option.
- `getDependents()` and `getDependencies()` were added to fetch the dependents or dependencies of an entity instance from the view. 
