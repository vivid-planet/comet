---
"@comet/cms-admin": patch
---

Set unhandled dependencies to `undefined` when copying documents to another scope

This prevents leaks between scopes. In practice, this mostly concerns links to documents that don't exist in the target scope.

**Example:**

- Page A links to Page B
- Page A is copied from Scope A to Scope B
- Link to Page B is removed from Page A by replacing the `id` with `undefined` (since Page B doesn't exist in Scope B)

**Note:** The link is only retained if both pages are copied in the same operation.
