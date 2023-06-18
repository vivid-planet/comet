import { CrudField, CrudGenerator, DocumentInterface } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, ManyToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Product } from "./product.entity";

@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class ProductTag extends BaseEntity<ProductTag, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    title: string;

    @CrudField({
        resolveField: true, //default is true
        //search: true, //not implemented
        //filter: true, //not implemented
        //sort: true, //not implemented
        input: true, //default is true
    })
    @ManyToMany(() => Product, (products) => products.tags)
    products = new Collection<Product>(this);

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
