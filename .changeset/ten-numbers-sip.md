---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Add scoping to the DAM

The DAM scoping can be enabled optionally. You can still use the DAM without scoping.

To enable DAM scoping, you must

- In the API: Pass a `Scope` class to the `DamModule`
- In the admin app: Add a `DamConfigProvider` with `scopeParts` (e.g. `<DamConfigProvider value={{ scopeParts: ["domain"] }}>`)

You can access the current DAM scope in the admin app using the `useDamScope()` hook.