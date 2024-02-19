import { DynamicModule, Global, Module } from "@nestjs/common";

import { MlConfig } from "./ml.config";
import { ML_CONFIG } from "./ml.constants";
import { MlResolver } from "./ml.resolver";
import { MlService } from "./ml.service";

@Global()
@Module({})
export class MlModule {
    static register(options: MlConfig): DynamicModule {
        const mlConfigProvider = {
            provide: ML_CONFIG,
            useValue: options,
        };

        return {
            module: MlModule,
            providers: [mlConfigProvider, MlService, MlResolver],
        };
    }
}
