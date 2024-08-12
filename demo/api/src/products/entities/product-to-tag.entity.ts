import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, types } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { Product } from "./product.entity";
import { ProductTag } from "./product-tag.entity";

@Entity()
@ObjectType()
export class ProductToTag extends BaseEntity<ProductToTag, "id"> {
    @Field()
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => Product, { onDelete: "cascade", ref: true })
    product: Ref<Product>;

    @ManyToOne(() => ProductTag, { onDelete: "cascade", ref: true })
    tag: Ref<ProductTag>;

    @Field()
    @Property({ type: types.boolean })
    exampleStatus: boolean = true;
}
