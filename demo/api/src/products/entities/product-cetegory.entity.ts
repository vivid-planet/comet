import { CrudGenerator, DocumentInterface } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Product } from "./product.entity";

@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class ProductCategory extends BaseEntity<ProductCategory, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    title: string;

    @Property()
    @Field()
    slug: string;

    @OneToMany(() => Product, (products) => products.category)
    /*
    @CrudRelationField({
        paging: true,
        filter: true,
        sort: true,
        mutations: true
    })
    */
    products = new Collection<Product>(this);

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
