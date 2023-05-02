import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { FooterFieldResolver } from "@src/footer/footer-field.resolver";

import { Footer } from "./entities/footer.entity";
import { FooterContentScope } from "./entities/footer-content-scope.entity";
import { FooterCrudResolver } from "./generated/footer.crud.resolver";
import { FootersService } from "./generated/footers.service";

@Module({
    imports: [MikroOrmModule.forFeature([Footer, FooterContentScope])],
    providers: [FooterCrudResolver, FootersService, FooterFieldResolver],
})
export class FooterModule {}
