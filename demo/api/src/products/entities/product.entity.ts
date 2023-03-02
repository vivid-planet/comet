import { CrudField, CrudGenerator, DocumentInterface } from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property, types } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity<Product, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    @CrudField({
        search: true,
        filter: true,
        sort: true,
        input: true,
    })
    title: string;

    @Property()
    @Field()
    slug: string;

    @Property()
    @Field()
    description: string;

    @Property({ type: types.decimal, nullable: true })
    @Field({ nullable: true })
    price?: number;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Property({ type: types.boolean })
    @Field()
    inStock: boolean = true;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
