---
"@comet/cms-api": major
---

Switch to SQL-based entity info system

Switch EntityInfo system from a TypeScript-based runtime approach to a SQL-based approach.
This change allows efficient filtering and sorting of dependencies and warnings based on entity info.

Furthermore:

- Add `blockVisible` and `entityVisible` to `block_index_dependencies`
- Change `visible` to be the combination of `blockVisible` and `entityVisible` (if one is false, the whole is false)

// this changeset will be expanded in the follow-up PRs
