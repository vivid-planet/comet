import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, Enum, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { ShopProductVariant } from "@src/shop-products/entities/shop-product-variant.entity";
import { v4 as uuid } from "uuid";

export enum ShopProductCategory {
    ELECTRONICS = "ELECTRONICS",
    CLOTHING = "CLOTHING",
    BEAUTY = "BEAUTY",
    GAMES = "GAMES",
}

registerEnumType(ShopProductCategory, {
    name: "ShopProductCategory",
});

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class ShopProduct extends BaseEntity<ShopProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    name: string;

    @Property()
    @Field()
    @CrudField({
        search: true,
        filter: false,
        sort: false,
        input: true,
    })
    description: string;

    @Property()
    @Field()
    price: number;

    @Enum({ items: () => ShopProductCategory })
    @Field(() => ShopProductCategory)
    category: ShopProductCategory;

    @ManyToMany(() => ShopProductVariant)
    variants = new Collection<ShopProductVariant>(this);
}
