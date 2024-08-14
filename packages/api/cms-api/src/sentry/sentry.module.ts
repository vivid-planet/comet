import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import type { NodeOptions } from "@sentry/node";

import { SENTRY_CONFIG } from "./sentry.constants";
import { SentryInterceptor } from "./sentry.interceptor";

type SentryNodeOptions = Omit<NodeOptions, "dsn" | "environment"> & {
    dsn: string;
    environment: string;
};

type Options = SentryNodeOptions & SentryConfig;

export type SentryConfig = {
    shouldReportException?: (exception: unknown) => boolean;
};

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SentryInterceptor,
        },
    ],
})
export class SentryModule {
    static async forRootAsync({ shouldReportException, ...options }: Options): Promise<DynamicModule> {
        const Sentry = await import("@sentry/node");

        const integrations = options.integrations ?? [new Sentry.Integrations.Http({ tracing: true })];

        Sentry.init({
            ...options,
            integrations,
        });

        return {
            module: SentryModule,
            providers: [
                {
                    provide: SENTRY_CONFIG,
                    useValue: { shouldReportException },
                },
            ],
        };
    }
}
