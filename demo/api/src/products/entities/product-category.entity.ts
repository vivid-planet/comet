import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, Enum, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Min } from "class-validator";
import { v4 as uuid } from "uuid";

import { Product, ProductStatus } from "./product.entity";

@ObjectType()
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["products"] })
export class ProductCategory extends BaseEntity<ProductCategory, "id"> {
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

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;

    @Enum({ items: () => ProductStatus })
    @Field(() => ProductStatus)
    status: ProductStatus = ProductStatus.Unpublished;

    @CrudField({
        resolveField: true, //default is true
        //search: true, //not implemented
        //filter: true, //not implemented
        //sort: true, //not implemented
        input: true, //default is true
    })
    @OneToMany(() => Product, (products) => products.category)
    products = new Collection<Product>(this);

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
