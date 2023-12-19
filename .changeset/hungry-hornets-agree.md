---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Enhance CronJob module

-   Show latest job run on `CronJobsPage`
-   Add option to manually trigger cron jobs to `CronJobsPage`
-   Add subpage to `CronJobsPage` that shows all job runs

Warning: Only include this module if all your users should be able to trigger cron jobs manually or you have sufficient access control in place.

Includes the following breaking changes:

-   Rename `JobStatus` to `KubernetesJobStatus` to avoid naming conflicts
-   Rename `BuildRuntime` to `JobRuntime`
