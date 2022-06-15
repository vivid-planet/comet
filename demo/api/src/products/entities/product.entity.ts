import { CrudQuery, DocumentInterface, EntityGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, PrimaryKey, Property, types } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@EntityGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity<Product, "id"> implements DocumentInterface {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property()
    @Field()
    @CrudQuery()
    title: string;

    @Property()
    @Field()
    slug: string;

    @Property({ type: types.decimal, nullable: true })
    @Field({ nullable: true })
    price?: number;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
