import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Footer } from "./entities/footer.entity";
import { FooterResolver } from "./generated/footer.resolver";
import { FootersService } from "./generated/footers.service";

@Module({
    imports: [MikroOrmModule.forFeature([Footer])],
    providers: [FootersService, FooterResolver],
})
export class FooterModule {}
