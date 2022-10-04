import { Embeddable, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType("RedirectScope")
@InputType("RedirectScopeInput")
export class RedirectScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;
}
