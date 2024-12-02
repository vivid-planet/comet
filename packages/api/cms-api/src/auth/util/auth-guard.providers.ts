import { Provider, Type } from "@nestjs/common";

import { AuthServiceInterface } from "./auth-service.interface";

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
        useFactory: (...args) => args,
        inject: authServiceNames,
    });
    return providers;
}
