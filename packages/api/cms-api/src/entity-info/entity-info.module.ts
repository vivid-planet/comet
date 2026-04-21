import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { EntityInfoObject } from "./entity-info.object";
import { EntityInfoService } from "./entity-info.service";
import { FullTextSearchResolver } from "./full-text-search.resolver";

export interface EntityInfoModuleOptions {
    fullText?: boolean;
}

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([EntityInfoObject])],
    providers: [EntityInfoService],
    exports: [EntityInfoService],
})
export class EntityInfoModule {
    static forRoot(options: EntityInfoModuleOptions): DynamicModule {
        const providers = options.fullText ? [FullTextSearchResolver] : [];

        return {
            module: EntityInfoModule,
            providers,
        };
    }
}
