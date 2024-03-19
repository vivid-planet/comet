import { Module } from "@nestjs/common";

import { TranslatorResolver } from "./translator.resolver";
import { TranslatorService } from "./translator.service";

@Module({
    providers: [TranslatorResolver, TranslatorService],
})
export class TranslatorModule {}
