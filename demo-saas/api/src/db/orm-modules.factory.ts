import { MikroOrmModule } from "@comet/cms-api";
import { type DynamicModule } from "@nestjs/common";

import { createOrmConfig } from "./ormconfig";

/**
 * Creates MikroORM modules based on the execution context.
 * When called from CLI, uses direct user credentials.
 * When called from the API server, uses RLS (Row Level Security) user for the default context.
 */
export function createOrmModules(): DynamicModule[] {
    const isCalledFromCli = process.env.CALLED_FROM_CLI === "true";

    // Default context (uses RLS user when running from API, direct user when from CLI)
    const defaultContext = MikroOrmModule.forRoot({
        ormConfig: createOrmConfig({
            user: isCalledFromCli ? process.env.POSTGRESQL_USER : process.env.POSTGRESQL_RLS_USER,
            password: isCalledFromCli ? process.env.POSTGRESQL_PWD : process.env.POSTGRESQL_RLS_PWD,
        }),
    });

    // Admin context (always uses direct user credentials)
    const adminContext = MikroOrmModule.forRoot({
        ormConfig: createOrmConfig({
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PWD,
            contextName: "admin",
        }),
    });

    return [defaultContext, adminContext];
}
