import { DamScopeType } from "@comet/cms-api";
import { Embeddable, Property } from "@mikro-orm/core";
import { Field } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@DamScopeType()
export class DamScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;
}
