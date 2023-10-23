import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CurrentUser } from "src/user-permissions/dto/current-user";

import { FILTER_AUTHENTICATED_REQUEST } from "./access-log.constants";
import { AccessLogInterceptor } from "./access-log.interceptor";

export type FilterAuthenticatedRequest = ({ user, authHeader }: { user?: CurrentUser; authHeader?: string }) => boolean;

interface AccessLogModuleOptions {
    filterAuthenticatedRequest?: FilterAuthenticatedRequest;
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
    static forRoot({ filterAuthenticatedRequest }: AccessLogModuleOptions): DynamicModule {
        return {
            module: AccessLogModule,
            providers: [
                {
                    provide: FILTER_AUTHENTICATED_REQUEST,
                    useValue: filterAuthenticatedRequest,
                },
            ],
        };
    }
}
