import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { TranslationModule } from "@src/translation/translation.module";

import { Bar } from "./entities/bar.entity";
import { Baz } from "./entities/baz.entity";
import { Foo } from "./entities/foo.entity";
import { BarResolver } from "./generated/bar.resolver";
import { BazResolver } from "./generated/baz.resolver";
import { FooResolver } from "./generated/foo.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Foo, Bar, Baz]), ConfigModule, TranslationModule],
    providers: [FooResolver, BarResolver, BazResolver],
    exports: [],
})
export class FooModule {}
