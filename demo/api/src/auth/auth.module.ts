import {
    CometAuthGuard,
    createAuthGuardProviders,
    createAuthResolver,
    createBasicAuthService,
    createJwtAuthService,
    createSitePreviewAuthService,
    createStaticUserAuthService,
} from "@comet/cms-api";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Config } from "@src/config/config";

import { AccessControlService } from "./access-control.service";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

export const SYSTEM_USER_NAME = "system-user";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        const authServices = [
            createBasicAuthService({
                username: SYSTEM_USER_NAME,
                password: config.auth.systemUserPassword,
            }),
            createSitePreviewAuthService({ sitePreviewSecret: config.sitePreviewSecret }),
        ];

        const providers: Provider[] = [
            createAuthResolver({
                postLogoutRedirectUri: config.auth.postLogoutRedirectUri,
                endSessionEndpoint: config.auth.idpEndSessionEndpoint,
            }),
            UserService,
            AccessControlService,
            {
                provide: APP_GUARD,
                useClass: CometAuthGuard,
            },
        ];

        if (config.auth.useAuthProxy) {
            authServices.push(
                createJwtAuthService({ verifyOptions: { secret: "secret" } }), // for testing purposes, send header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fG9j2rVOgunoya_njgn9w1t8muFlrpE9ffJ9i8sJYsQ"
            );
        } else {
            if (process.env.NODE_ENV !== "development") {
                throw new Error("config.auth.useAuthproxy must only be false in development");
            }
            authServices.push(
                createJwtAuthService({
                    verifyOptions: { secret: "secret" },
                    convertJwtToUser: UserService,
                }), // for testing purposes, send header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fG9j2rVOgunoya_njgn9w1t8muFlrpE9ffJ9i8sJYsQ"
            );
            authServices.push(createStaticUserAuthService({ staticUser: staticUsers[0] }));
        }

        providers.push(...createAuthGuardProviders(...authServices));

        return {
            module: AuthModule,
            imports: [JwtModule],
            providers,
            exports: [AccessControlService, UserService],
        };
    }
}
