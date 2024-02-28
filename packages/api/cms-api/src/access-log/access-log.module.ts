import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Request } from "express";
import { CurrentUserInterface } from "src/auth/current-user/current-user";

import { SHOULD_LOG_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type ShouldLogRequest = ({ user, req }: { user?: CurrentUserInterface | true; req: Request }) => boolean;

interface AccessLogModuleOptions {
    shouldLogRequest?: ShouldLogRequest;
}

@Global()
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AccessLogInterceptor,
        },
    ],
})
export class AccessLogModule {
    static forRoot({ shouldLogRequest }: AccessLogModuleOptions): DynamicModule {
        return {
            module: AccessLogModule,
            providers: [
                {
                    provide: SHOULD_LOG_REQUEST,
                    useValue: shouldLogRequest,
                },
            ],
        };
    }
}
