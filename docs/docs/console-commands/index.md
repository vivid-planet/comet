---
title: Console Commands
sidebar_position: 13
---

We use [NestJS Console](https://github.com/Pop-Code/nestjs-console) to create console commands. Console commands can be used locally or deployed.

## Defining Commands

```ts title="Demo console command"
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

@Injectable()
@Console()
export class DemoConsole {
    private readonly logger = new Logger(DemoConsole.name);

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

## Listing all available commands

Locally

```bash
npm run console
```

Deployed

```bash
npm run console:prod
```

## Running commands

Locally

```bash
npm run console demo-command
```

Deployed

```bash
npm run console:prod demo-command
```

## Best practices

-   Dangerous commands (e.g. resetting the database) should check the `NODE_ENV` and only run locally.

```ts
async execute(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
        this.logger.error("Not allowed in production environments");
        process.exit(1);
    }

    // ...
}
```
