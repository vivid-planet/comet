---
"@comet/cms-admin": minor
---

Copy referenced entities to the target scope when copying content across scopes

Copying content into another scope (copying a page, or now also pasting a block) copies the entities it references — most notably DAM files — to the target scope and rewrites the references, instead of leaving dangling references. The flow is driven by a registry of `ScopeCopyHandler`s, so projects can define how their own entity types are handled. The DAM file handler is built in.

See [Copying across scopes](https://docs.comet-dxp.com/docs/core-concepts/dependencies/copying-across-scopes) for details, how to register a handler, and how to reuse the mechanism when copying your own entities across scopes.
