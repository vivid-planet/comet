import { CrudField, CrudGenerator } from "@comet/cms-api";
import { Entity, Property } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({
    expression: 'SELECT "addressAsEmbeddable_country" AS id, COUNT(*) AS used FROM "Manufacturer" GROUP BY "addressAsEmbeddable_country"',
})
// view-entity can't be saved or updated so disable create, update and delete
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, create: false, update: false, delete: false })
export class ManufacturerCountry {
    @Field()
    @Property()
    @CrudField({ sort: false }) // sort for "group by"-views currently not supported
    id: string;

    @Field()
    @Property()
    @CrudField({ sort: false }) // sort for "group by"-views currently not supported
    used: number;
}
