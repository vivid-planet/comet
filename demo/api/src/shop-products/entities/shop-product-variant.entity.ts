import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { ShopProduct } from "./shop-product.entity";

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class ShopProductVariant extends BaseEntity<ShopProductVariant, "id"> {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @ManyToOne(() => ShopProduct, { ref: true })
    product: Ref<ShopProduct>;

    @Property()
    @Field()
    name: string;

    @Property()
    @Field()
    size: string;

    @Property()
    @Field()
    color: string;

    @Property()
    @Field()
    price: number;
}
