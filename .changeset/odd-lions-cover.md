---
"@comet/cms-api": patch
---

Handle DAM scope correctly in the `findCopiesOfFileInScope` query and the `importDamFileByDownload` mutation

Previously, these endpoints would cause errors if no DAM scoping was used.
