import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Module, Type } from "@nestjs/common";

import { BrevoApiModule } from "../brevo-api/brevo-api.module";
import { EmailCampaignScopeInterface } from "../types";
import { createBrevoConfigResolver } from "./brevo-config.resolver";
import { BrevoConfigInterface } from "./entities/brevo-config-entity.factory";

interface BrevoConfigModuleConfig {
    Scope: Type<EmailCampaignScopeInterface>;
    BrevoConfig: Type<BrevoConfigInterface>;
}

@Module({})
export class BrevoConfigModule {
    static register({ Scope, BrevoConfig }: BrevoConfigModuleConfig): DynamicModule {
        const BrevoConfigResolver = createBrevoConfigResolver({ BrevoConfig, Scope });

        return {
            module: BrevoConfigModule,
            imports: [MikroOrmModule.forFeature([BrevoConfig]), BrevoApiModule],
            providers: [BrevoConfigResolver],
        };
    }
}
