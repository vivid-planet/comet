import { CrudField, CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property, types } from "@mikro-orm/postgresql";
import { Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

export enum ProductStatus {
    Published = "Published",
    Unpublished = "Unpublished",
    Deleted = "Deleted",
}
registerEnumType(ProductStatus, { name: "ProductStatus" });

@ObjectType()
@Entity()
@RootBlockEntity<Product>({ isVisible: (product) => product.status === ProductStatus.Published })
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Enum({ items: () => ProductStatus })
    @Field(() => ProductStatus)
    status: ProductStatus = ProductStatus.Unpublished;

    @Property({ type: types.decimal, nullable: true })
    @Field(() => Int, { nullable: true })
    @CrudField({
        input: false,
    })
    soldCount?: number;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
