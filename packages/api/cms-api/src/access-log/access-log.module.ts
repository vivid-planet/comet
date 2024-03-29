import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Request } from "express";

import { CurrentUser } from "../user-permissions/dto/current-user";
import { SystemUser } from "../user-permissions/user-permissions.types";
import { SHOULD_LOG_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type ShouldLogRequest = ({ user, req }: { user?: CurrentUser | SystemUser; req: Request }) => boolean;

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
