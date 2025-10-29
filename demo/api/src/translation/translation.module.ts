import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";

import { TranslationService } from "./translation.service";

@Module({
    imports: [ConfigModule],
    providers: [TranslationService],
    exports: [TranslationService],
})
export class TranslationModule {}
