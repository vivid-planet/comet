import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ShopProductCategory } from "@src/shop-products/entities/shop-product-category.entitiy";
import { ShopProductVariant } from "@src/shop-products/entities/shop-product-variant.entity";
import { v4 as uuid } from "uuid";

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

    @ManyToMany(() => ShopProductCategory, "products", { owner: true })
    category = new Collection<ShopProductCategory>(this);

    @OneToMany(() => ShopProductVariant, (variant) => variant.product)
    variants = new Collection<ShopProductVariant>(this);
}
