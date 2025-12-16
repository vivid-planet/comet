import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { ContactFormResolver } from "./contact-form.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([])],
    providers: [ContactFormResolver],
    exports: [],
})
export class ContactFormModule {}
