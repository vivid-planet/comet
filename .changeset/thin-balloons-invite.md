---
"@comet/cms-api": patch
---

ChangesCheckerConsole: Start exactly matching job or all partially matching jobs

Previously, the first job with a partially matching content scope was started.
Doing so could lead to problems when multiple jobs with overlapping content scopes exist.
For instance, jobs with the scopes `{ domain: "main", language: "de" }` and `{ domain: "main", language: "en" }` both partially match a change in `{ domain: "main", language: "de" }`.
To fix this, we now either start a single job if the content scope matches exactly, or start all jobs with partially matching content scopes.
