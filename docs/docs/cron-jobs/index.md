---
title: Cron Jobs
sidebar_position: 14
---

Cron Jobs are defined as console commands. The preferred way to run them is as a [Kubernetes CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). Advantages of using Kubernetes Cron Jobs:

-   You can run multiple instances of the API in parallel without additional configuration for Cron Jobs.
-   Different resources can be used for Cron Jobs and the API.
-   You don't have to worry about blocking the API event loop.

## Best Practices

-   Test your Cron Job locally with the specified memory resource request.

```bash
NODE_OPTIONS='--max-old-space-size=256' npm run console demo-command
```

-   If you're using Kubernetes, avoid running a Cron Job every minute, as this will create a lot of overhead.

-   Don't run every Cron Job simultaneously (e.g. always on the first minute of an hour), as this might create a considerable load on all involved systems.

-   If you need alerting, consider using a Heartbeat monitor.

-   Ensure that your Cron Job allows repeated runs so manual runs are possible.

## Cron Job Module

A `CronJobModule` is available for `@comet/cms-api` which adds GraphQL queries and mutations for interacting with Cron Jobs. A `CronJobsPage` is available for `@comet/cms-admin` to display and manage Cron Jobs.

:::caution
If including the Cron Job module, ensure you have proper access control in place as this module allows interacting with the Kubernetes API.
:::

### Scoping

The Cron Job Module respects the [Kubernetes annotation](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) `comet-dxp.com/content-scope` and will only allow access to the Cron Job if the user can access the specified content scope.

```yaml
…
metadata:
    annotations:
        comet-dxp.com/content-scope: "{ \"domain\": \"main\", \"language\": \"en\" }"
…
```

### Labeling

Cron Jobs and Jobs can be given a human-readable label using the [Kubernetes annotation](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) `comet-dxp.com/label`.

```yaml
…
metadata:
    annotations:
        comet-dxp.com/label: "Demo Cron Job"
…
```
