import { CrudField, CrudGenerator, FileUpload, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Min } from "class-validator";
import { v4 as uuid } from "uuid";

import { Product } from "./product.entity";

@ObjectType()
@Entity()
@RootBlockEntity()
@CrudGenerator({
    targetDirectory: `${__dirname}/../generated/`,
    requiredPermission: "products",
    position: { groupByFields: ["product"] },
})
export class ProductVariant extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    name: string;

    @ManyToOne(() => FileUpload, { nullable: true, ref: true })
    @Field(() => FileUpload, { nullable: true })
    image?: Ref<FileUpload> = undefined;

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;

    @ManyToOne(() => Product, { ref: true })
    @CrudField({
        resolveField: true, // default is true
        // search: true, // not yet supported for nested
        // filter: true, // not yet supported for nested
        // sort: true, // not yet supported for nested
        // input: false, // ignored because product is a root argument for create
        dedicatedResolverArg: true, //default is false
    })
    product: Ref<Product>;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
