import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ShopProduct } from "@src/shop-products/entities/shop-product.entity";
import { v4 as uuid } from "uuid";

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated` })
export class ShopProductCategory extends BaseEntity<ShopProductCategory, "id"> {
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

    @OneToMany(() => ShopProduct, (product) => product.category)
    products = new Collection<ShopProduct>(this);
}
