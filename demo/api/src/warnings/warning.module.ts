import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Warning])],
    providers: [WarningResolver],
})
export class WarningsModule {}
