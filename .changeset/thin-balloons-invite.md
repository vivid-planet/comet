---
"@comet/cms-api": patch
---

ChangesCheckerConsole: Use the best matching builder cron job

Previously, the first job with a partially matching content scope was started.
Doing so could lead to problems when multiple jobs with overlapping content scopes exist.
For instance, jobs with the scopes `{ domain: "main", language: "de" }` and `{ domain: "main", language: "en" }` both partially match a change in `{ domain: "main", language: "de" }`.
To fix this, we now prioritize a job if the scope is an exact match.
