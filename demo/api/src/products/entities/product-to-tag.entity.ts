import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, types } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { ProductTag } from "./product-tag.entity";

@Entity()
@ObjectType()
export class ProductToTag extends BaseEntity {
    @Field()
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => ProductTag, { deleteRule: "cascade", ref: true })
    tag: Ref<ProductTag>;

    @Field()
    @Property({ type: types.boolean })
    exampleStatus: boolean = true;
}
