import {
    CometAuthGuard,
    createAuthGuardProviders,
    createAuthResolver,
    createBasicAuthService,
    createJwtAuthService,
    createSitePreviewAuthService,
    createStaticUserAuthService,
} from "@comet/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
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
        return {
            module: AuthModule,
            providers: [
                ...createAuthGuardProviders(
                    createBasicAuthService({
                        username: SYSTEM_USER_NAME,
                        password: config.auth.systemUserPassword,
                    }),
                    createJwtAuthService({ verifyOptions: { secret: "secret" } }), // for testing purposes, send header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fG9j2rVOgunoya_njgn9w1t8muFlrpE9ffJ9i8sJYsQ"
                    createSitePreviewAuthService({ sitePreviewSecret: config.sitePreviewSecret }),
                    createStaticUserAuthService({ staticUser: staticUsers[0] }),
                ),
                createAuthResolver(),
                {
                    provide: APP_GUARD,
                    useClass: CometAuthGuard,
                },
                UserService,
                AccessControlService,
            ],
            exports: [UserService, AccessControlService],
            imports: [JwtModule],
        };
    }
}
