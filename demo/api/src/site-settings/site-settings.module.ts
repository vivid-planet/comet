import { DependenciesResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { SiteSettingsScope } from "./dto/site-settings-scope";
import { SiteSettings } from "./entities/site-settings.entity";
import { SiteSettingsResolver } from "./generated/site-settings.resolver";
import { SiteSettingsService } from "./generated/site-settings.service";

@Module({
    imports: [MikroOrmModule.forFeature([SiteSettings, SiteSettingsScope])],
    providers: [SiteSettingsService, SiteSettingsResolver, DependenciesResolverFactory.create(SiteSettings)],
})
export class SiteSettingsModule {}
