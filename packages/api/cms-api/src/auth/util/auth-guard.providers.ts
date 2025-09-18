import { type Provider, type Type } from "@nestjs/common";

import { type AuthServiceInterface } from "./auth-service.interface.js";

export function createAuthGuardProviders(...authServices: Type<AuthServiceInterface>[]): Provider[] {
    const providers: Provider[] = [];
    const authServiceNames: string[] = [];
    authServices.forEach((authService, index) => {
        const authServiceName = `auth_service_${index}`;
        authServiceNames.push(authServiceName);
        providers.push({
            provide: authServiceName,
            useClass: authService,
        });
    });
    providers.push({
        provide: "COMET_AUTH_SERVICES",
        useFactory: (...authServices) => authServices,
        inject: authServiceNames,
    });
    return providers;
}
