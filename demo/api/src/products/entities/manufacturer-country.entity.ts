import { Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({
    expression: 'SELECT "addressAsEmbeddable_country" AS country, COUNT(*) AS used FROM "Manufacturer" GROUP BY "addressAsEmbeddable_country"',
})
export class ManufacturerCountry {
    @Field()
    @Property()
    country: string;

    @Field()
    @Property()
    used: number;
}
