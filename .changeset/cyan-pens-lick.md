---
"@comet/cms-api": patch
---

Make `import-redirects` console script consider scope when loading the target `PageTreeNode` for a redirect

Previously, the scope wasn't considered when loading the node.
This resulted in redirects that targeted a node in a different scope -> these redirects didn't work.
