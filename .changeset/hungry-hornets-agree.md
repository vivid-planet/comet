---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Enhance CronJob Module

-   CronJob page now shows lastest job run
-   CronJob page allows to trigger cron jobs manually
-   Subpage of CronJob page shows all job runs

Warning: Only include this module if all your users should be able to trigger cron jobs manually or you have sufficient access control in place.

Includes following changes to the public api:

-   JobStatus is renamed to KubernetesJobStatus to avoid naming conflicts
-   Rename BuildRuntime to JobRuntime
