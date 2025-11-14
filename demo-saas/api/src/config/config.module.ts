import { DynamicModule, Global, Module } from "@nestjs/common";

import { Config } from "./config";

export const CONFIG = "config";

@Global()
@Module({})
export class ConfigModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: CONFIG,
                    useValue: config,
                },
            ],
            exports: [CONFIG],
        };
    }
}
