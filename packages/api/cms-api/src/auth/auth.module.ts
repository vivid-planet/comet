import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";

import { AUTH_CONFIG } from "./auth.constants";
import { createAuthAuthedUserResolver } from "./auth.resolver";
import { CurrentUserInterface } from "./dto/current-user";
import { AuthedUserStrategy } from "./strategies/authed-user.strategy";

export interface AuthedUserConfig<CurrentUser> {
    authedUser: CurrentUser;
}

export interface AuthModuleAuthedUserOptions<CurrentUser extends CurrentUserInterface> extends Pick<ModuleMetadata, "imports"> {
    readonly strategy: "authedUser";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthedUserConfig<CurrentUser>> | AuthedUserConfig<CurrentUser>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserDto: Type<CurrentUser>;
}

@Module({})
export class AuthModule {
    static register<CurrentUser extends CurrentUserInterface>(options: AuthModuleAuthedUserOptions<CurrentUser>): DynamicModule {
        const providers: Provider[] = [
            {
                provide: AUTH_CONFIG,
                ...options,
            },
        ];
        if (options.strategy === "authedUser") {
            providers.push(AuthedUserStrategy, createAuthAuthedUserResolver<CurrentUser>(options.currentUserDto));
        }

        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers,
        };
    }
}
