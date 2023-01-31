import { Embeddable, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@Embeddable()
@ObjectType()
export class DamScope {
    @Property({ columnType: "text" })
    @Field()
    domain: string;
}
