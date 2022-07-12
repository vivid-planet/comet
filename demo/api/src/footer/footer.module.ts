import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Footer } from "./entities/footer.entity";
import { FooterContentScope } from "./entities/footer-content-scope.entity";
import { FootersResolver } from "./footer.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Footer, FooterContentScope])],
    providers: [FootersResolver],
})
export class FooterModule {}
