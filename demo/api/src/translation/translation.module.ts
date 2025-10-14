import { Module } from "@nestjs/common";

import { TranslationService } from "./translation.service";

@Module({
    providers: [TranslationService],
    exports: [TranslationService],
})
export class TranslationModule {}
