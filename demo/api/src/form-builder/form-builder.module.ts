import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { FormBuilder } from "./entities/form-builder.entity";
import { FormRequest } from "./entities/form-request.entity";
import { FormBuilderResolver } from "./generated/form-builder.resolver";
import { FormRequestResolver } from "./generated/form-request.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([FormBuilder, FormRequest])],
    providers: [FormBuilderResolver, FormRequestResolver],
})
export class FormBuilderModule {}
