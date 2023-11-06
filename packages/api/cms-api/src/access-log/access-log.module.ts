import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Request } from "express";

import { CurrentUser } from "../user-permissions/dto/current-user";
import { FILTER_AUTHENTICATED_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type FilterRequests = ({ user, req }: { user?: CurrentUser | true; req: Request }) => boolean;

interface AccessLogModuleOptions {
    filterRequests?: FilterRequests;
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
    static forRoot({ filterRequests }: AccessLogModuleOptions): DynamicModule {
        return {
            module: AccessLogModule,
            providers: [
                {
                    provide: FILTER_AUTHENTICATED_REQUEST,
                    useValue: filterRequests,
                },
            ],
        };
    }
}
