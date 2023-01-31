import { Embeddable, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType()
export class DamScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;
}
