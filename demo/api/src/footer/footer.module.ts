import { DependenciesResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Footer } from "./entities/footer.entity";
import { FooterContentScope } from "./entities/footer-content-scope.entity";
import { FooterResolver } from "./generated/footer.resolver";
import { FootersService } from "./generated/footers.service";

@Module({
    imports: [MikroOrmModule.forFeature([Footer, FooterContentScope])],
    providers: [FooterResolver, FootersService, DependenciesResolverFactory.create(Footer)],
})
export class FooterModule {}
