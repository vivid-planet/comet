import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { SentryInterceptor, SentryInterceptorOptions } from "./sentry.intercepor";

type SentryNodeOptions = Omit<import("@sentry/node").NodeOptions, "dsn" | "environment"> & {
    dsn: string;
    environment: string;
};

type Options = SentryNodeOptions & SentryInterceptorOptions;

@Module({})
export class SentryModule {
    static async forRootAsync(options: Options): Promise<DynamicModule> {
        const Sentry = await import("@sentry/node");

        if (!Sentry) {
            return {
                module: SentryModule,
            };
        }

        const integrations = options.integrations ?? [new Sentry.Integrations.Http({ tracing: true })];

        Sentry.init({
            ...options,
            integrations,
        });

        return {
            module: SentryModule,
            providers: [
                {
                    provide: APP_INTERCEPTOR,
                    useFactory: () => new SentryInterceptor(options, Sentry),
                },
            ],
        };
    }
}
