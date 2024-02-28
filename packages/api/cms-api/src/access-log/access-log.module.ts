import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Request } from "express";

import { CurrentUser } from "../user-permissions/dto/current-user";
import { SystemUser } from "../user-permissions/user-permissions.types";
import { ENABLE_LOGGING_IN_DEVELOPMENT, SHOULD_LOG_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type ShouldLogRequest = ({ user, req }: { user?: CurrentUser | SystemUser; req: Request }) => boolean;

interface AccessLogModuleOptions {
    shouldLogRequest?: ShouldLogRequest;
    enableLoggingInDevelopment?: boolean;
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
    static forRoot({ shouldLogRequest, enableLoggingInDevelopment = false }: AccessLogModuleOptions): DynamicModule {
        return {
            module: AccessLogModule,
            providers: [
                {
                    provide: SHOULD_LOG_REQUEST,
                    useValue: shouldLogRequest,
                },
                {
                    provide: ENABLE_LOGGING_IN_DEVELOPMENT,
                    useValue: enableLoggingInDevelopment,
                },
            ],
        };
    }
}
