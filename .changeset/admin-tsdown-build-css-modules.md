---
"@comet/admin": patch
---

Build `@comet/admin` with tsdown so CSS Modules are supported in the published package

CSS Modules (`*.module.css`) imported from source are now compiled into the package build: the static class-name mapping is emitted alongside the JavaScript and the styles are bundled into `lib/style.css`. The class names are generated statically and deterministically so they stay stable across builds.
