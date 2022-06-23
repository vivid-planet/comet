import { BaseEntity, BigIntType, Entity, Index, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

@ObjectType("PublicUpload")
@Entity()
export class PublicUpload extends BaseEntity<PublicUpload, "id"> {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @Field(() => ID)
    @PrimaryKey({ columnType: "uuid" })
    id: string = v4();

    @Field()
    @Property({ columnType: "text" })
    name: string;

    @Field(() => Int)
    @Property({ type: BigIntType })
    size: number;

    @Field()
    @Property({ columnType: "text" })
    mimetype: string;

    @Field()
    @Property({ columnType: "character(32)" })
    @Index()
    contentHash: string;

    @Field()
    @Property({
        columnType: "timestamp with time zone",
    })
    createdAt: Date = new Date(); // TODO: delete after x days?

    @Field()
    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    updatedAt: Date = new Date();
}
