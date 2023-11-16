---
"@comet/cms-admin": major
"@comet/blocks-admin": major
"@comet/cms-api": minor
---

Support automatically importing DAM files into another scope when copying documents from one scope to another

The copy process was reworked:

- The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
- The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method 
- `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

`dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents.