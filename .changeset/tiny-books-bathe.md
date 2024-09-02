---
"@comet/cms-api": patch
---

`BuildsService`: Start all jobs that match the scope exactly

Previously, the first job that matched the scope exactly would be started, and the rest would be ignored. This has been fixed so that all jobs that match the scope exactly are started.
