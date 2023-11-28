import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Request } from "express";

import { CurrentUser } from "../user-permissions/dto/current-user";
import { FILTER_AUTHENTICATED_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type FilterRequest = ({ user, req }: { user?: CurrentUser | true; req: Request }) => boolean;

interface AccessLogModuleOptions {
    shouldLogRequest?: FilterRequest;
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
                    provide: FILTER_AUTHENTICATED_REQUEST,
                    useValue: shouldLogRequest,
                },
            ],
        };
    }
}
