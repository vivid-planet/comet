---
title: Cron Jobs
sidebar_position: 13
---

Cron Jobs are defined as [NestJS Console](https://github.com/Pop-Code/nestjs-console) commands. The preferred way to run them is a [Kubernetes CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). Advantages of using Kubernetes Cron Jobs:

-   You can run multiple instances of the API in parallel without additional configuration for Cron Jobs.
-   Different resources can be used for Cron Jobs and the API.
-   You don't have to worry about blocking the API event loop.

## Defining Cron Jobs

```ts title="Demo Cron Job"
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

@Injectable()
@Console()
export class ProductsConsole {
    private readonly logger = new Logger(ProductsConsole.name);

    constructor(
        private readonly orm: MikroORM, // MikroORM is injected so we can use the request context
    ) {}

    @Command({
        command: "demo-command",
        description: "Demo-Command for cronjob-deployment",
    })
    @UseRequestContext()
    async demoCommand(): Promise<void> {
        this.logger.log("Execute demo-command.");
    }
}
```

## Running Cron Jobs

Locally

```bash
npm run console demo-command
```

Deployed

```bash
npm run console:prod demo-command
```

## Best Practices

-   Test your Cron Job locally with the specified memory resource request.

```bash
NODE_OPTIONS='--max-old-space-size=256' npm run console demo-command
```

-   If using Kubernetes, avoid running a Cron Job every minute, as this will create a lot of overhead.

-   Don't run every Cron Job simultaneously (e.g. always on the first minute of an hour), as this might create a considerable load on all involved systems.

-   If you need altering, consider using some Heartbeat monitor.

-   Ensure that your Cron Job allows repeated runs so manual runs are possible.

## Cron Job Module

A `CronJobModule` is available for `@comet/cms-api` which adds GraphQL queries and mutations for interacting with CronJobs. A `CronJobsPage` is available for `@comet/cms-admin` to display and manage Cron Jobs.

:::caution
If including the Cron Job module, ensure you have proper access control in place as this module allows interacting with Cron Jobs.
:::

### Scoping

The Cron Job Module respects the annotation `comet-dxp.com/content-scope` and will only allow access to the Cron Job if the user can access the specified content scope.

### Naming

Cron Jobs and Jobs can be given a human-readable label using the annotation `comet-dxp.com/label`.
