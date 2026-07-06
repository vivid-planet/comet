import { DynamicModule, Global, Module } from "@nestjs/common";

import { BrevoModuleConfig } from "./brevo-module.config";
import { BREVO_MODULE_CONFIG } from "./brevo-module.constants";

@Global()
@Module({})
export class ConfigModule {
    static forRoot(config: BrevoModuleConfig): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: BREVO_MODULE_CONFIG,
                    useValue: config,
                },
            ],
            exports: [BREVO_MODULE_CONFIG],
        };
    }
}
