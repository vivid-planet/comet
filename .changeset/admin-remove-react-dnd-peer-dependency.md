---
"@comet/admin": major
---

Remove the `react-dnd` peer dependency

`@comet/admin` no longer depends on `react-dnd`. The only component that used it (`TableDndOrder`) has moved to `@comet/admin-legacy`, which declares `react-dnd` itself. If your project doesn't use `react-dnd` directly, you can remove it from your dependencies.
