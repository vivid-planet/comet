import { Injectable } from "@nestjs/common";

import { User } from "../../user-permissions/interfaces/user";
import { AuthServiceInterface } from "../util/auth-service.interface";

interface StaticUserAuthServiceConfig {
    staticUser: User | string;
}

export function createStaticUserAuthService(config: StaticUserAuthServiceConfig) {
    @Injectable()
    class StaticUserAuthService implements AuthServiceInterface {
        async authenticateUser() {
            return config.staticUser;
        }
    }
    return StaticUserAuthService;
}
