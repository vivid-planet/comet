import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { ProjectPermission } from "@src/common/enum/project-permission.enum";
import { Min } from "class-validator";
import { v4 as uuid } from "uuid";

import { Product } from "./product.entity";

@ObjectType()
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: [ProjectPermission.products] })
export class ProductCategory extends BaseEntity {
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
